'use client'

import { useState, useTransition } from 'react'
import {
  addShip, removeShip, updateShipNickname, toggleShipVisibility,
  addWeaponToShip, removeWeaponFromShip,
  addUpgradeToShip, removeUpgradeFromShip,
  addAmmoToShip, removeAmmoFromShip,
  addCrewToShip, removeCrewFromShip,
} from '@/app/actions/fleet'

type Ship = { id: string; name: string; rate: number; shipClass: string; hp: number | null; speed: number | null; crewCapacity: number | null; cannonSlots: number | null }
type Weapon = { id: string; name: string; type: string; tier: string | null; damage: number | null }
type Upgrade = { id: string; name: string; slot: string | null; effect: string | null }
type Ammo = { id: string; name: string; effect: string | null }
type Crew = { id: string; name: string }

type UserShipWeapon = { id: string; weapon: Weapon; quantity: number }
type UserShipUpgrade = { id: string; upgrade: Upgrade }
type UserShipAmmo = { id: string; ammoType: Ammo; quantity: number }
type UserShipCrew = { id: string; crewType: Crew; quantity: number }

type UserShip = {
  id: string; shipId: string; nickname: string | null; isPublic: boolean; createdAt: string
  ship: Ship
  weapons: UserShipWeapon[]
  upgrades: UserShipUpgrade[]
  ammo: UserShipAmmo[]
  crew: UserShipCrew[]
}

interface Props {
  initialFleet: UserShip[]
  shipCatalog: Ship[]
  weaponCatalog: Weapon[]
  upgradeCatalog: Upgrade[]
  ammoCatalog: Ammo[]
  crewCatalog: Crew[]
}

export default function FleetClient({ initialFleet, shipCatalog, weaponCatalog, upgradeCatalog, ammoCatalog, crewCatalog }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [loadoutShipId, setLoadoutShipId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const [selectedShipId, setSelectedShipId] = useState('')
  const [nickname, setNickname] = useState('')

  function handleAdd() {
    if (!selectedShipId) return
    startTransition(async () => {
      await addShip(selectedShipId, nickname || undefined)
      setShowAddModal(false)
      setSelectedShipId('')
      setNickname('')
    })
  }

  function handleRemove(id: string) {
    if (!confirm('Remove this ship from your fleet?')) return
    startTransition(() => removeShip(id))
  }

  function handleToggleVisibility(id: string) {
    startTransition(() => toggleShipVisibility(id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">🚢 Fleet Tracker</h1>
        <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors font-medium">
          + Add Ship
        </button>
      </div>

      {initialFleet.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-foreground-secondary text-lg">No ships in your fleet yet. Add your first ship!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {initialFleet.map((us) => (
            <div key={us.id} className="bg-surface border border-surface-border rounded-xl overflow-hidden">
              <div
                className="p-5 cursor-pointer hover:bg-background/50 transition-colors"
                onClick={() => setExpandedId(expandedId === us.id ? null : us.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {us.ship.name}
                      {us.nickname && <span className="text-accent ml-2">&ldquo;{us.nickname}&rdquo;</span>}
                    </h3>
                    <div className="flex flex-wrap gap-3 mt-1 text-sm text-foreground-secondary">
                      <span>Class: {us.ship.shipClass}</span>
                      <span>Rate: {us.ship.rate}</span>
                      {us.ship.hp && <span>HP: {us.ship.hp}</span>}
                      {us.ship.speed && <span>Speed: {us.ship.speed}</span>}
                      {us.ship.crewCapacity && <span>Crew: {us.ship.crewCapacity}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleToggleVisibility(us.id) }}
                      className={`px-3 py-1 text-xs rounded border ${us.isPublic ? 'border-accent text-accent' : 'border-surface-border text-foreground-secondary'}`}
                    >
                      {us.isPublic ? '👁 Public' : '🔒 Private'}
                    </button>
                    <span className="text-foreground-secondary text-sm">{expandedId === us.id ? '▲' : '▼'}</span>
                  </div>
                </div>
              </div>

              {expandedId === us.id && (
                <div className="border-t border-surface-border p-5 space-y-4">
                  {/* Loadout summary */}
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <LoadoutSection title="⚔️ Weapons" items={us.weapons.map(w => `${w.weapon.name} x${w.quantity}`)} />
                    <LoadoutSection title="🛡️ Upgrades" items={us.upgrades.map(u => u.upgrade.name)} />
                    <LoadoutSection title="💣 Ammo" items={us.ammo.map(a => `${a.ammoType.name} x${a.quantity}`)} />
                    <LoadoutSection title="👥 Crew" items={us.crew.map(c => `${c.crewType.name} x${c.quantity}`)} />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setLoadoutShipId(loadoutShipId === us.id ? null : us.id)}
                      className="px-4 py-2 text-sm border border-accent text-accent rounded-lg hover:bg-accent hover:text-background transition-colors"
                    >
                      ✏️ Edit Loadout
                    </button>
                    <button
                      onClick={() => handleRemove(us.id)}
                      className="px-4 py-2 text-sm border border-surface-border text-foreground-secondary rounded-lg hover:border-primary hover:text-primary transition-colors"
                    >
                      🗑 Remove Ship
                    </button>
                  </div>

                  {loadoutShipId === us.id && (
                    <LoadoutEditor
                      userShipId={us.id}
                      weapons={weaponCatalog}
                      upgrades={upgradeCatalog}
                      ammo={ammoCatalog}
                      crew={crewCatalog}
                      startTransition={startTransition}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Ship Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
          <div className="bg-surface border border-surface-border rounded-xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-foreground mb-4">Add Ship to Fleet</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-foreground-secondary mb-1">Ship</label>
                <select
                  value={selectedShipId}
                  onChange={(e) => setSelectedShipId(e.target.value)}
                  className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-foreground focus:border-accent focus:outline-none"
                >
                  <option value="">Select a ship…</option>
                  {shipCatalog.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (Rate {s.rate}, {s.shipClass})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-foreground-secondary mb-1">Nickname (optional)</label>
                <input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="e.g. The Crimson Fury"
                  className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-foreground focus:border-accent focus:outline-none"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm border border-surface-border text-foreground-secondary rounded-lg hover:text-foreground transition-colors">
                  Cancel
                </button>
                <button onClick={handleAdd} disabled={!selectedShipId || isPending} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50">
                  {isPending ? 'Adding…' : 'Add Ship'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isPending && (
        <div className="fixed bottom-4 right-4 bg-surface border border-surface-border rounded-lg px-4 py-2 text-sm text-foreground-secondary">
          Updating…
        </div>
      )}
    </div>
  )
}

function LoadoutSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-background/50 rounded-lg p-3">
      <h4 className="text-sm font-medium text-accent mb-1">{title}</h4>
      {items.length === 0 ? (
        <p className="text-xs text-foreground-secondary">None</p>
      ) : (
        <ul className="text-xs text-foreground-secondary space-y-0.5">
          {items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      )}
    </div>
  )
}

function LoadoutEditor({
  userShipId, weapons, upgrades, ammo, crew, startTransition,
}: {
  userShipId: string
  weapons: Weapon[]
  upgrades: Upgrade[]
  ammo: Ammo[]
  crew: Crew[]
  startTransition: (fn: () => void) => void
}) {
  const [tab, setTab] = useState<'weapons' | 'upgrades' | 'ammo' | 'crew'>('weapons')
  const [selectedId, setSelectedId] = useState('')
  const [qty, setQty] = useState(1)

  const tabs = ['weapons', 'upgrades', 'ammo', 'crew'] as const

  function handleAddItem() {
    if (!selectedId) return
    startTransition(async () => {
      if (tab === 'weapons') await addWeaponToShip(userShipId, selectedId, qty)
      else if (tab === 'upgrades') await addUpgradeToShip(userShipId, selectedId)
      else if (tab === 'ammo') await addAmmoToShip(userShipId, selectedId, qty)
      else await addCrewToShip(userShipId, selectedId, qty)
      setSelectedId('')
      setQty(1)
    })
  }

  const catalog = tab === 'weapons' ? weapons : tab === 'upgrades' ? upgrades : tab === 'ammo' ? ammo : crew
  const showQty = tab !== 'upgrades'

  return (
    <div className="border border-surface-border rounded-lg p-4 mt-2">
      <div className="flex gap-2 mb-4">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setSelectedId('') }}
            className={`px-3 py-1 text-sm rounded-lg capitalize ${tab === t ? 'bg-primary text-primary-foreground' : 'border border-surface-border text-foreground-secondary hover:text-foreground'}`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-foreground text-sm focus:border-accent focus:outline-none"
          >
            <option value="">Select {tab.slice(0, -1)}…</option>
            {catalog.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </div>
        {showQty && (
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-20 bg-surface border border-surface-border rounded-lg px-3 py-2 text-foreground text-sm focus:border-accent focus:outline-none"
          />
        )}
        <button onClick={handleAddItem} disabled={!selectedId} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50">
          Add
        </button>
      </div>
    </div>
  )
}
