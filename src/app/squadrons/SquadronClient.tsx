'use client'

import { useState, useTransition } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  createSquadron,
  renameSquadron,
  deleteSquadron,
  addShipToSquadron,
  removeShipFromSquadron,
  reorderSquadronSlots,
} from '@/app/actions/squadron'
import { computeModifiedStats, computeShipDPS } from '@/lib/statEngine'

// ============================================================
// TYPES
// ============================================================

type UpgradeEffect = { stat: string; value: string; gameKey?: string; rankedValues?: string[] }

type SlotData = {
  id: string
  position: number
  userShip: {
    id: string
    user: { id: string; username: string }
    ship: {
      id: string; name: string; rate: number; shipClass: string
      hp: number | null; speed: number | null; maneuverability: number | null
      broadsideArmor: number | null; cargoHold: number | null
      crewCapacity: number | null; integrity: number | null
      broadsideSlots: number; mortarSlots: number
    }
    loadouts: {
      id: string; isActive: boolean
      weapons: { id: string; weapon: { penetration: number | null; loading: number | null; damage: number | null; penetrationMulti: string | null; name: string }; position: string; quantity: number }[]
      upgrades: { id: string; upgrade: { effects: UpgradeEffect[] | null; effect: string | null } }[]
      crew: { id: string; crewType: { name: string }; quantity: number }[]
    }[]
  }
}

type SquadronData = {
  id: string
  name: string
  createdAt: string
  createdBy: { id: string; username: string; rank: string }
  slots: SlotData[]
}

type GuildShip = {
  id: string
  user: { id: string; username: string }
  ship: { id: string; name: string; rate: number }
  loadouts: { id: string; isActive: boolean }[]
}

interface Props {
  squadrons: SquadronData[]
  guildFleet: GuildShip[] | null
  currentUserId: string
  currentUserRank: string
}

// ============================================================
// SORTABLE SLOT ROW
// ============================================================

function SortableSlotRow({
  slot,
  canEdit,
  squadronId,
  startTransition,
}: {
  slot: SlotData
  canEdit: boolean
  squadronId: string
  startTransition: (fn: () => void) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: slot.id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  const { userShip } = slot
  const activeLoadout = userShip.loadouts.find(l => l.isActive) || userShip.loadouts[0]

  // Compute modified stats
  const shipStats = {
    hp: userShip.ship.hp,
    speed: userShip.ship.speed,
    maneuverability: userShip.ship.maneuverability,
    broadsideArmor: userShip.ship.broadsideArmor,
    cargoHold: userShip.ship.cargoHold,
    crewCapacity: userShip.ship.crewCapacity,
    integrity: userShip.ship.integrity,
    broadsideSlots: userShip.ship.broadsideSlots,
    mortarSlots: userShip.ship.mortarSlots,
    rate: userShip.ship.rate,
  }

  const modStats = activeLoadout
    ? computeModifiedStats(shipStats, activeLoadout.upgrades, activeLoadout.crew)
    : null

  const dps = activeLoadout ? computeShipDPS(activeLoadout.weapons) : 0

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="grid grid-cols-[auto_1.2fr_1.5fr_0.6fr_0.8fr_0.8fr_0.6fr_0.6fr_auto] gap-2 items-center px-4 py-3 bg-surface border-b border-surface-border last:border-b-0 text-sm"
    >
      {canEdit ? (
        <span {...attributes} {...listeners} className="cursor-grab text-foreground-secondary hover:text-foreground">⠿</span>
      ) : (
        <span className="text-foreground-secondary/30">⠿</span>
      )}
      <span className="text-foreground-secondary truncate">{userShip.user.username}</span>
      <span className="text-foreground font-medium truncate">{userShip.ship.name}</span>
      <span className="text-foreground-secondary text-center">{modStats?.speed ?? userShip.ship.speed ?? '—'}</span>
      <span className="text-foreground-secondary text-center">{modStats?.maneuverability ?? userShip.ship.maneuverability ?? '—'}</span>
      <span className="text-foreground-secondary text-center">{modStats?.hp ?? userShip.ship.hp ?? '—'}</span>
      <span className="text-foreground-secondary text-center">{modStats?.crewCapacity ?? userShip.ship.crewCapacity ?? '—'}</span>
      <span className="text-accent text-center font-medium">{dps > 0 ? dps : '—'}</span>
      {canEdit ? (
        <button
          onClick={() => {
            if (confirm('Remove this ship from the squadron?'))
              startTransition(() => removeShipFromSquadron(squadronId, userShip.id))
          }}
          className="text-foreground-secondary hover:text-primary transition-colors"
        >✕</button>
      ) : (
        <span />
      )}
    </div>
  )
}

// ============================================================
// SQUADRON CARD
// ============================================================

function SquadronCard({
  squadron,
  guildFleet,
  currentUserId,
  isLeader,
}: {
  squadron: SquadronData
  guildFleet: GuildShip[] | null
  currentUserId: string
  isLeader: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const [isEditing, setIsEditing] = useState(false)
  const [nameInput, setNameInput] = useState(squadron.name)
  const [showAddShip, setShowAddShip] = useState(false)
  const [selectedShipId, setSelectedShipId] = useState('')
  const [localSlots, setLocalSlots] = useState(squadron.slots)

  const isCreator = squadron.createdBy.id === currentUserId
  const canEdit = isCreator && isLeader

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  // Sync slots when squadron prop changes
  if (squadron.slots !== localSlots && JSON.stringify(squadron.slots.map(s => s.id)) !== JSON.stringify(localSlots.map(s => s.id))) {
    setLocalSlots(squadron.slots)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = localSlots.findIndex(s => s.id === active.id)
    const newIndex = localSlots.findIndex(s => s.id === over.id)
    const newSlots = arrayMove(localSlots, oldIndex, newIndex)
    setLocalSlots(newSlots)

    startTransition(() => reorderSquadronSlots(squadron.id, newSlots.map(s => s.id)))
  }

  function handleRename() {
    if (nameInput.trim() && nameInput !== squadron.name) {
      startTransition(() => renameSquadron(squadron.id, nameInput.trim()))
    }
    setIsEditing(false)
  }

  function handleAddShip() {
    if (!selectedShipId) return
    startTransition(async () => {
      await addShipToSquadron(squadron.id, selectedShipId)
      setSelectedShipId('')
      setShowAddShip(false)
    })
  }

  // Filter guild fleet to exclude ships already in this squadron
  const existingShipIds = new Set(localSlots.map(s => s.userShip.id))
  const availableShips = guildFleet?.filter(s => !existingShipIds.has(s.id)) ?? []

  // Compute total DPS
  const totalDPS = localSlots.reduce((sum, slot) => {
    const activeLoadout = slot.userShip.loadouts.find(l => l.isActive) || slot.userShip.loadouts[0]
    return sum + (activeLoadout ? computeShipDPS(activeLoadout.weapons) : 0)
  }, 0)

  return (
    <div className="bg-surface border border-surface-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border">
        <div className="flex items-center gap-3">
          {isEditing && canEdit ? (
            <input
              autoFocus
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onBlur={handleRename}
              onKeyDown={e => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') { setNameInput(squadron.name); setIsEditing(false) } }}
              className="bg-background border border-accent rounded px-2 py-1 text-foreground font-bold text-lg focus:outline-none"
            />
          ) : (
            <h2
              className={`text-lg font-bold text-foreground ${canEdit ? 'cursor-pointer hover:text-accent' : ''}`}
              onClick={() => canEdit && setIsEditing(true)}
              title={canEdit ? 'Click to rename' : undefined}
            >
              ⚔️ {squadron.name}
            </h2>
          )}
          <span className="text-xs text-foreground-secondary">by {squadron.createdBy.username}</span>
          {localSlots.length > 0 && (
            <span className="text-xs text-accent font-medium">{localSlots.length} ships · {Math.round(totalDPS)} total DPS</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {canEdit && (
            <>
              <button
                onClick={() => setShowAddShip(!showAddShip)}
                className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors"
              >
                + Add Ship
              </button>
              <button
                onClick={() => { if (confirm('Delete this squadron?')) startTransition(() => deleteSquadron(squadron.id)) }}
                className="px-3 py-1.5 text-xs border border-surface-border text-foreground-secondary rounded-lg hover:border-primary hover:text-primary transition-colors"
              >
                🗑
              </button>
            </>
          )}
        </div>
      </div>

      {/* Add Ship Dropdown */}
      {showAddShip && canEdit && (
        <div className="px-5 py-3 border-b border-surface-border bg-background/50 flex gap-2 items-center">
          <select
            value={selectedShipId}
            onChange={e => setSelectedShipId(e.target.value)}
            className="flex-1 bg-surface border border-surface-border rounded px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
          >
            <option value="">Select a ship from the guild fleet…</option>
            {availableShips.map(s => (
              <option key={s.id} value={s.id}>
                {s.user.username} — {s.ship.name} (Rate {s.ship.rate})
              </option>
            ))}
          </select>
          <button
            onClick={handleAddShip}
            disabled={!selectedShipId || isPending}
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover disabled:opacity-50"
          >
            {isPending ? 'Adding…' : 'Add'}
          </button>
          <button
            onClick={() => { setShowAddShip(false); setSelectedShipId('') }}
            className="px-3 py-2 text-sm text-foreground-secondary hover:text-foreground"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Column Headers */}
      {localSlots.length > 0 && (
        <div className="grid grid-cols-[auto_1.2fr_1.5fr_0.6fr_0.8fr_0.8fr_0.6fr_0.6fr_auto] gap-2 px-4 py-2 bg-surface/50 text-xs font-medium text-foreground-secondary uppercase tracking-wider border-b border-surface-border">
          <span />
          <span>Player</span>
          <span>Ship</span>
          <span className="text-center">Spd</span>
          <span className="text-center">Mnvr</span>
          <span className="text-center">HP</span>
          <span className="text-center">Crew</span>
          <span className="text-center">DPS</span>
          <span />
        </div>
      )}

      {/* Slots */}
      {localSlots.length === 0 ? (
        <div className="px-5 py-8 text-center text-foreground-secondary text-sm">
          No ships assigned yet.{canEdit ? ' Click "Add Ship" to build your squadron.' : ''}
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={localSlots.map(s => s.id)} strategy={verticalListSortingStrategy}>
            {localSlots.map(slot => (
              <SortableSlotRow
                key={slot.id}
                slot={slot}
                canEdit={canEdit}
                squadronId={squadron.id}
                startTransition={startTransition}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}

      {isPending && (
        <div className="px-5 py-2 text-xs text-foreground-secondary text-center">Updating…</div>
      )}
    </div>
  )
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function SquadronClient({ squadrons, guildFleet, currentUserId, currentUserRank }: Props) {
  const [isPending, startTransition] = useTransition()
  const [newName, setNewName] = useState('')
  const [showCreate, setShowCreate] = useState(false)

  const isLeader = currentUserRank === 'FOUNDER' || currentUserRank === 'ADMIRAL'

  function handleCreate() {
    const name = newName.trim() || 'New Squadron'
    startTransition(async () => {
      await createSquadron(name)
      setNewName('')
      setShowCreate(false)
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">⚔️ Squadron Builder</h1>
        {isLeader && (
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors font-medium"
          >
            + Create Squadron
          </button>
        )}
      </div>

      {/* Create Form */}
      {showCreate && isLeader && (
        <div className="mb-6 bg-surface border border-surface-border rounded-xl p-4 flex gap-3 items-center">
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Squadron name…"
            onKeyDown={e => { if (e.key === 'Enter') handleCreate() }}
            className="flex-1 bg-background border border-surface-border rounded-lg px-3 py-2 text-foreground focus:border-accent focus:outline-none"
          />
          <button
            onClick={handleCreate}
            disabled={isPending}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover disabled:opacity-50"
          >
            {isPending ? 'Creating…' : 'Create'}
          </button>
          <button
            onClick={() => { setShowCreate(false); setNewName('') }}
            className="px-3 py-2 text-foreground-secondary hover:text-foreground"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Squadron List */}
      {squadrons.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-foreground-secondary text-lg">No squadrons yet.</p>
          {isLeader && <p className="text-foreground-secondary text-sm mt-2">Create your first squadron to start planning battles!</p>}
        </div>
      ) : (
        <div className="space-y-6">
          {squadrons.map(sq => (
            <SquadronCard
              key={sq.id}
              squadron={sq}
              guildFleet={guildFleet}
              currentUserId={currentUserId}
              isLeader={isLeader}
            />
          ))}
        </div>
      )}
    </div>
  )
}
