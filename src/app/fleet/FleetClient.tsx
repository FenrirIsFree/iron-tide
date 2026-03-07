'use client'

import { useState, useTransition, useMemo } from 'react'
import {
  addShip, removeShip, updateShipNickname, toggleShipVisibility,
  addLoadout, removeLoadout, setActiveLoadout, renameLoadout,
  addWeaponToLoadout, removeWeaponFromLoadout,
  addUpgradeToLoadout, removeUpgradeFromLoadout,
  addAmmoToLoadout, removeAmmoFromLoadout,
  addCrewToLoadout, removeCrewFromLoadout, updateCrewQuantity,
} from '@/app/actions/fleet'

// ============================================================
// TYPES
// ============================================================

type Ship = {
  id: string; name: string; rate: number; shipClass: string; role: string | null
  faction: string | null; hp: number | null; speed: number | null
  maneuverability: number | null; broadsideArmor: number | null
  cargoHold: number | null; crewCapacity: number | null
  displacement: string | null; integrity: number | null
  weaponClass: string | null
  sternSlots: number; broadsideSlots: number; bowSlots: number
  swivelGuns: number; mortarSlots: number; mortarMaxCaliber: number | null
  specialWeaponSlots: number
}
type Weapon = {
  id: string; name: string; weightClass: string; type: string
  penetration: number | null; penetrationMulti: string | null
  loading: number | null; range: number | null; rangeMin: number | null
  maxAngle: number | null; accuracySpread: number | null
  damage: number | null; splashRadius: number | null; reduction: number | null
  preparation: number | null; firingTime: number | null; damageUnit: string | null
  caliber: number | null; placementRestriction: string | null
  isPremium: boolean; description: string | null
}
type UpgradeEffect = { stat: string; value: string }
type Upgrade = { id: string; name: string; slot: string | null; effect: string | null; effects: UpgradeEffect[] | null }
type Ammo = { id: string; name: string; effect: string | null }
type Crew = { id: string; name: string; description: string | null }

type LoadoutWeapon = { id: string; weapon: Weapon; position: string; quantity: number }
type LoadoutUpgrade = { id: string; upgrade: Upgrade }
type LoadoutAmmo = { id: string; ammoType: Ammo; quantity: number }
type LoadoutCrew = { id: string; crewType: Crew; quantity: number }

type Loadout = {
  id: string; name: string; isActive: boolean
  weapons: LoadoutWeapon[]; upgrades: LoadoutUpgrade[]
  ammo: LoadoutAmmo[]; crew: LoadoutCrew[]
}

type UserShip = {
  id: string; shipId: string; nickname: string | null; isPublic: boolean; createdAt: string
  ship: Ship; loadouts: Loadout[]
}

interface Props {
  initialFleet: UserShip[]
  shipCatalog: Ship[]
  weaponCatalog: Weapon[]
  upgradeCatalog: Upgrade[]
  ammoCatalog: Ammo[]
  crewCatalog: Crew[]
}

const BASIC_CREW = ['Sailor', 'Musketeer', 'Soldier', 'Mercenary']

type SortKey = 'name' | 'rate' | 'class' | 'date'

// ============================================================
// STAT MODIFIER ENGINE
// ============================================================

type ModifiedStats = {
  hp: number | null
  speed: number | null
  maneuverability: number | null
  broadsideArmor: number | null
  cargoHold: number | null
  crewCapacity: number | null
  integrity: number | null
  broadsideSlots: number
  mortarSlots: number
}

function parseModValue(value: string): { amount: number; isPercent: boolean; isAbsolute: boolean } {
  const isPercent = value.includes('%')
  const cleaned = value.replace(/[%+]/g, '').trim()
  const amount = parseFloat(cleaned)
  return { amount: isNaN(amount) ? 0 : amount, isPercent, isAbsolute: !isPercent }
}

function applyMod(base: number | null, value: string): number | null {
  if (base == null) return base
  const { amount, isPercent } = parseModValue(value)
  if (isPercent) return Math.round(base * (1 + amount / 100))
  return Math.round(base + amount)
}

function computeModifiedStats(ship: Ship, equippedUpgrades: LoadoutUpgrade[]): ModifiedStats {
  const stats: ModifiedStats = {
    hp: ship.hp,
    speed: ship.speed,
    maneuverability: ship.maneuverability,
    broadsideArmor: ship.broadsideArmor,
    cargoHold: ship.cargoHold,
    crewCapacity: ship.crewCapacity,
    integrity: ship.integrity,
    broadsideSlots: ship.broadsideSlots,
    mortarSlots: ship.mortarSlots,
  }

  for (const lu of equippedUpgrades) {
    const effects = (lu.upgrade as Upgrade).effects
    if (!effects) continue
    for (const e of effects) {
      const s = e.stat.toLowerCase()
      if (s.includes('speed') && !s.includes('reload') && !s.includes('aiming') && !s.includes('cruise') && !s.includes('switch') && !s.includes('collection') && !s.includes('fishing') && !s.includes('turning') && !s.includes('projectile')) {
        stats.speed = applyMod(stats.speed, e.value) as number | null
      } else if (s === 'maneuverability') {
        stats.maneuverability = applyMod(stats.maneuverability, e.value) as number | null
      } else if (s === 'armor' || s === 'broadside armor') {
        stats.broadsideArmor = applyMod(stats.broadsideArmor, e.value) as number | null
      } else if (s === 'hold') {
        stats.cargoHold = applyMod(stats.cargoHold, e.value) as number | null
      } else if (s === 'crew') {
        stats.crewCapacity = applyMod(stats.crewCapacity, e.value) as number | null
      } else if (s.includes('durability')) {
        stats.integrity = applyMod(stats.integrity, e.value) as number | null
      } else if (s === 'mortar slots') {
        const { amount } = parseModValue(e.value)
        stats.mortarSlots += amount
      } else if (s === 'weapons on each side') {
        const { amount } = parseModValue(e.value)
        stats.broadsideSlots = Math.max(0, stats.broadsideSlots + amount)
      }
    }
  }

  return stats
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function FleetClient({ initialFleet, shipCatalog, weaponCatalog, upgradeCatalog, ammoCatalog, crewCatalog }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Sorting & filtering
  const [sortBy, setSortBy] = useState<SortKey>('date')
  const [filterRate, setFilterRate] = useState<number | null>(null)
  const [filterWeaponClass, setFilterWeaponClass] = useState<string | null>(null)
  const [filterRole, setFilterRole] = useState<string | null>(null)

  // Add ship form
  const [selectedShipId, setSelectedShipId] = useState('')
  const [nickname, setNickname] = useState('')

  const filtered = useMemo(() => {
    let list = [...initialFleet]
    if (filterRate !== null) list = list.filter(us => us.ship.rate === filterRate)
    if (filterWeaponClass) list = list.filter(us => us.ship.weaponClass === filterWeaponClass)
    if (filterRole) list = list.filter(us => us.ship.role === filterRole)

    list.sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.ship.name.localeCompare(b.ship.name)
        case 'rate': return a.ship.rate - b.ship.rate
        case 'class': return a.ship.shipClass.localeCompare(b.ship.shipClass)
        case 'date': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        default: return 0
      }
    })
    return list
  }, [initialFleet, sortBy, filterRate, filterWeaponClass, filterRole])

  const roles = useMemo(() => [...new Set(initialFleet.map(us => us.ship.role).filter(Boolean))], [initialFleet])

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

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">🚢 Fleet Tracker</h1>
        <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors font-medium">
          + Add Ship
        </button>
      </div>

      {/* Filters & Sort */}
      <div className="flex flex-wrap gap-3 mb-6 items-center text-sm">
        <label className="text-foreground-secondary">Sort:</label>
        <select value={sortBy} onChange={e => setSortBy(e.target.value as SortKey)} className="bg-surface border border-surface-border rounded px-2 py-1 text-foreground text-sm">
          <option value="date">Date Added</option>
          <option value="name">Name</option>
          <option value="rate">Rate</option>
          <option value="class">Class</option>
        </select>

        <span className="text-surface-border">|</span>

        <label className="text-foreground-secondary">Rate:</label>
        <select value={filterRate ?? ''} onChange={e => setFilterRate(e.target.value ? Number(e.target.value) : null)} className="bg-surface border border-surface-border rounded px-2 py-1 text-foreground text-sm">
          <option value="">All</option>
          {[1,2,3,4,5,6,7].map(r => <option key={r} value={r}>{r}</option>)}
        </select>

        <label className="text-foreground-secondary">Weapon:</label>
        <select value={filterWeaponClass ?? ''} onChange={e => setFilterWeaponClass(e.target.value || null)} className="bg-surface border border-surface-border rounded px-2 py-1 text-foreground text-sm">
          <option value="">All</option>
          <option value="Light">Light</option>
          <option value="Medium">Medium</option>
          <option value="Heavy">Heavy</option>
        </select>

        {roles.length > 0 && (
          <>
            <label className="text-foreground-secondary">Role:</label>
            <select value={filterRole ?? ''} onChange={e => setFilterRole(e.target.value || null)} className="bg-surface border border-surface-border rounded px-2 py-1 text-foreground text-sm">
              <option value="">All</option>
              {roles.map(r => <option key={r} value={r!}>{r}</option>)}
            </select>
          </>
        )}
      </div>

      {/* Fleet Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-foreground-secondary text-lg">{initialFleet.length === 0 ? 'No ships in your fleet yet. Add your first ship!' : 'No ships match your filters.'}</p>
        </div>
      ) : (
        <div className="border border-surface-border rounded-xl overflow-hidden">
          {/* Table header */}
          <div className="hidden md:grid grid-cols-[2fr_0.5fr_1fr_0.8fr_0.8fr_0.8fr_1.5fr] gap-2 px-5 py-3 bg-surface/50 text-xs font-medium text-foreground-secondary uppercase tracking-wider border-b border-surface-border">
            <span>Ship</span>
            <span>Rate</span>
            <span>Class</span>
            <span>Weapons</span>
            <span>Broad/side</span>
            <span>Crew</span>
            <span>Active Loadout</span>
          </div>

          {filtered.map((us) => {
            const active = us.loadouts.find(l => l.isActive) || us.loadouts[0]
            const weaponSummary = active ? active.weapons.filter(w => w.position !== 'starboard').map(w => `${w.weapon.name} x${w.quantity}`).join(', ') || '—' : '—'

            return (
              <div key={us.id} className="bg-surface border-b border-surface-border last:border-b-0">
                {/* Row */}
                <div
                  className="grid md:grid-cols-[2fr_0.5fr_1fr_0.8fr_0.8fr_0.8fr_1.5fr] gap-2 px-5 py-4 cursor-pointer hover:bg-background/50 transition-colors items-center"
                  onClick={() => setExpandedId(expandedId === us.id ? null : us.id)}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">
                      {us.ship.name}
                      {us.nickname && <span className="text-accent ml-1 font-normal">&ldquo;{us.nickname}&rdquo;</span>}
                    </span>
                    {!us.isPublic && <span className="text-xs text-foreground-secondary">🔒</span>}
                  </div>
                  <span className="text-foreground-secondary">{us.ship.rate}</span>
                  <span className="text-foreground-secondary text-sm">{us.ship.shipClass}</span>
                  <span className="text-foreground-secondary text-sm">{us.ship.weaponClass || '—'}</span>
                  <span className="text-foreground-secondary text-sm">{us.ship.broadsideSlots}</span>
                  <span className="text-foreground-secondary text-sm">{us.ship.crewCapacity || '—'}</span>
                  <span className="text-foreground-secondary text-xs truncate">{weaponSummary}</span>
                </div>

                {/* Expanded view */}
                {expandedId === us.id && (
                  <ExpandedShipView
                    userShip={us}
                    weaponCatalog={weaponCatalog}
                    upgradeCatalog={upgradeCatalog}
                    ammoCatalog={ammoCatalog}
                    crewCatalog={crewCatalog}
                    isPending={isPending}
                    startTransition={startTransition}
                    onRemove={() => handleRemove(us.id)}
                  />
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Add Ship Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
          <div className="bg-surface border border-surface-border rounded-xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-foreground mb-4">Add Ship to Fleet</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-foreground-secondary mb-1">Ship</label>
                <select value={selectedShipId} onChange={e => setSelectedShipId(e.target.value)} className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-foreground focus:border-accent focus:outline-none">
                  <option value="">Select a ship…</option>
                  {shipCatalog.map(s => (
                    <option key={s.id} value={s.id}>{s.name} (Rate {s.rate}, {s.shipClass}, {s.weaponClass || '?'})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-foreground-secondary mb-1">Nickname (optional)</label>
                <input value={nickname} onChange={e => setNickname(e.target.value)} placeholder="e.g. The Crimson Fury" className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-foreground focus:border-accent focus:outline-none" />
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm border border-surface-border text-foreground-secondary rounded-lg hover:text-foreground transition-colors">Cancel</button>
                <button onClick={handleAdd} disabled={!selectedShipId || isPending} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50">
                  {isPending ? 'Adding…' : 'Add Ship'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isPending && (
        <div className="fixed bottom-4 right-4 bg-surface border border-surface-border rounded-lg px-4 py-2 text-sm text-foreground-secondary">Updating…</div>
      )}
    </div>
  )
}

// ============================================================
// EXPANDED SHIP VIEW
// ============================================================

function ExpandedShipView({
  userShip, weaponCatalog, upgradeCatalog, ammoCatalog, crewCatalog, isPending, startTransition, onRemove,
}: {
  userShip: UserShip
  weaponCatalog: Weapon[]
  upgradeCatalog: Upgrade[]
  ammoCatalog: Ammo[]
  crewCatalog: Crew[]
  isPending: boolean
  startTransition: (fn: () => void) => void
  onRemove: () => void
}) {
  const { ship, loadouts } = userShip
  const [activeTab, setActiveTab] = useState(loadouts.find(l => l.isActive)?.id || loadouts[0]?.id)
  const currentLoadout = loadouts.find(l => l.id === activeTab) || loadouts[0]

  // Compute modified stats based on current loadout's upgrades
  const modStats = currentLoadout ? computeModifiedStats(ship, currentLoadout.upgrades) : null

  return (
    <div className="border-t border-surface-border p-5 space-y-5">
      {/* Ship Stats — Base + Modified */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <StatBadge label="HP" base={ship.hp} modified={modStats?.hp} />
        <StatBadge label="Speed" base={ship.speed} modified={modStats?.speed} />
        <StatBadge label="Maneuver" base={ship.maneuverability} modified={modStats?.maneuverability} />
        <StatBadge label="Armor" base={ship.broadsideArmor} modified={modStats?.broadsideArmor} />
        <StatBadge label="Crew Cap" base={ship.crewCapacity} modified={modStats?.crewCapacity} />
        <StatBadge label="Cargo" base={ship.cargoHold} modified={modStats?.cargoHold} />
        <StatBadge label="Durability" base={ship.integrity} modified={modStats?.integrity} />
      </div>

      {/* Weapon Slots Summary — uses modified values */}
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="bg-background/50 rounded px-2 py-1 text-foreground-secondary">Stern: {ship.sternSlots}</span>
        <SlotBadge label="Broadside/side" base={ship.broadsideSlots} modified={modStats?.broadsideSlots} />
        <span className="bg-background/50 rounded px-2 py-1 text-foreground-secondary">Bow: {ship.bowSlots}</span>
        <span className="bg-background/50 rounded px-2 py-1 text-foreground-secondary">Swivel: {ship.swivelGuns}</span>
        {(modStats?.mortarSlots ?? ship.mortarSlots) > 0 && (
          <span className="bg-background/50 rounded px-2 py-1 text-foreground-secondary">
            Mortar: {modStats?.mortarSlots ?? ship.mortarSlots} (max {ship.mortarMaxCaliber || MORTAR_MOD_SHIPS[ship.name]}&quot;)
          </span>
        )}
        {ship.specialWeaponSlots > 0 && <span className="bg-background/50 rounded px-2 py-1 text-foreground-secondary">Special: {ship.specialWeaponSlots}</span>}
      </div>

      {/* Loadout Tabs */}
      <div className="flex items-center gap-2 border-b border-surface-border pb-2">
        {loadouts.map(l => (
          <button
            key={l.id}
            onClick={() => setActiveTab(l.id)}
            className={`px-3 py-1.5 text-sm rounded-t-lg transition-colors flex items-center gap-1 ${
              activeTab === l.id ? 'bg-primary text-primary-foreground' : 'text-foreground-secondary hover:text-foreground'
            }`}
          >
            {l.isActive && <span>⭐</span>}
            {l.name}
          </button>
        ))}
        {loadouts.length < 3 && (
          <button
            onClick={() => startTransition(() => addLoadout(userShip.id))}
            className="px-2 py-1 text-xs text-foreground-secondary hover:text-accent border border-dashed border-surface-border rounded"
          >
            +
          </button>
        )}
      </div>

      {/* Loadout Controls */}
      {currentLoadout && (
        <div className="flex items-center gap-2 text-xs">
          {!currentLoadout.isActive && (
            <button onClick={() => startTransition(() => setActiveLoadout(currentLoadout.id))} className="px-2 py-1 border border-accent text-accent rounded hover:bg-accent hover:text-background transition-colors">
              ⭐ Set Active
            </button>
          )}
          <button
            onClick={() => {
              const name = prompt('Rename loadout:', currentLoadout.name)
              if (name) startTransition(() => renameLoadout(currentLoadout.id, name))
            }}
            className="px-2 py-1 border border-surface-border text-foreground-secondary rounded hover:text-foreground transition-colors"
          >
            ✏️ Rename
          </button>
          {loadouts.length > 1 && !currentLoadout.isActive && (
            <button
              onClick={() => { if (confirm('Delete this loadout?')) startTransition(() => removeLoadout(currentLoadout.id)) }}
              className="px-2 py-1 border border-surface-border text-foreground-secondary rounded hover:text-primary hover:border-primary transition-colors"
            >
              🗑 Delete
            </button>
          )}
        </div>
      )}

      {/* Loadout Content */}
      {currentLoadout && (
        <div className="space-y-4">
          <WeaponPositionsPanel
            ship={ship}
            loadout={currentLoadout}
            weaponCatalog={weaponCatalog}
            modStats={modStats}
            startTransition={startTransition}
          />
          <CrewPanel
            ship={ship}
            loadout={currentLoadout}
            crewCatalog={crewCatalog}
            modStats={modStats}
            startTransition={startTransition}
          />
          <UpgradesPanel
            ship={ship}
            loadout={currentLoadout}
            upgradeCatalog={upgradeCatalog}
            startTransition={startTransition}
          />
          <AmmoPanel
            loadout={currentLoadout}
            ammoCatalog={ammoCatalog}
            startTransition={startTransition}
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <button onClick={() => startTransition(() => toggleShipVisibility(userShip.id))} className="px-3 py-1.5 text-xs border border-surface-border text-foreground-secondary rounded-lg hover:text-foreground transition-colors">
          {userShip.isPublic ? '🔒 Make Private' : '👁 Make Public'}
        </button>
        <button onClick={onRemove} className="px-3 py-1.5 text-xs border border-surface-border text-foreground-secondary rounded-lg hover:border-primary hover:text-primary transition-colors">
          🗑 Remove Ship
        </button>
      </div>
    </div>
  )
}

function StatBadge({ label, base, modified }: { label: string; base: number | string | null | undefined; modified?: number | string | null | undefined }) {
  const hasChange = modified != null && base != null && modified !== base
  const isPositive = hasChange && Number(modified) > Number(base)
  const isNegative = hasChange && Number(modified) < Number(base)

  return (
    <div className="bg-background/50 rounded-lg p-2 text-center">
      <div className="text-xs text-foreground-secondary">{label}</div>
      {hasChange ? (
        <div className="flex flex-col items-center">
          <span className="text-xs text-foreground-secondary line-through">{base}</span>
          <span className={`text-sm font-medium ${isPositive ? 'text-green-400' : isNegative ? 'text-red-400' : 'text-foreground'}`}>
            {modified}
          </span>
        </div>
      ) : (
        <div className="text-sm font-medium text-foreground">{base ?? '—'}</div>
      )}
    </div>
  )
}

function SlotBadge({ label, base, modified }: { label: string; base: number; modified?: number }) {
  const hasChange = modified != null && modified !== base
  return (
    <span className="bg-background/50 rounded px-2 py-1 text-foreground-secondary">
      {label}: {hasChange ? (
        <><span className="line-through">{base}</span> <span className={modified! < base ? 'text-red-400' : 'text-green-400'}>{modified}</span></>
      ) : base}
    </span>
  )
}

// ============================================================
// WEAPON POSITIONS PANEL
// ============================================================

function getCompatibleWeapons(weaponCatalog: Weapon[], ship: Ship, position: string): Weapon[] {
  const classHierarchy: Record<string, string[]> = {
    'Heavy': ['Light', 'Medium', 'Heavy'],
    'Medium': ['Light', 'Medium'],
    'Light': ['Light'],
  }
  const allowed = classHierarchy[ship.weaponClass || 'Light'] || ['Light']

  return weaponCatalog.filter(w => {
    if (position === 'mortar') {
      if (w.type !== 'Mortar') return false
      if (ship.mortarMaxCaliber && w.caliber && w.caliber > ship.mortarMaxCaliber) return false
      return true
    }
    if (position === 'special') {
      return w.type === 'Special'
    }
    // Regular positions: stern, port, starboard, bow
    if (w.type === 'Mortar' || w.type === 'Special') return false
    if (!allowed.includes(w.weightClass)) return false
    if (w.placementRestriction === 'Only for the bow or stern') {
      return position === 'stern' || position === 'bow'
    }
    if (w.placementRestriction === 'For special ships') return false
    return true
  })
}

// Ships that can get mortar slots via the "Mortar Fitted" upgrade
const MORTAR_MOD_SHIPS: Record<string, number> = {
  'Falmouth': 7,
  'Black Wind': 7,
  'Friede': 6,
}

function WeaponPositionsPanel({ ship, loadout, weaponCatalog, modStats, startTransition }: {
  ship: Ship; loadout: Loadout; weaponCatalog: Weapon[]; modStats: ModifiedStats | null
  startTransition: (fn: () => void) => void
}) {
  const effectiveBroadside = modStats?.broadsideSlots ?? ship.broadsideSlots
  const effectiveMortarSlots = modStats?.mortarSlots ?? ship.mortarSlots
  const effectiveMortarCaliber = ship.mortarMaxCaliber || MORTAR_MOD_SHIPS[ship.name] || null

  const positions: { key: string; label: string; slots: number; note?: string }[] = [
    { key: 'stern', label: 'Stern', slots: ship.sternSlots },
    { key: 'port', label: 'Port', slots: effectiveBroadside },
    { key: 'starboard', label: 'Starboard', slots: effectiveBroadside },
    { key: 'bow', label: 'Bow', slots: ship.bowSlots },
  ]
  if (effectiveMortarSlots > 0) positions.push({ key: 'mortar', label: 'Mortar', slots: effectiveMortarSlots, note: `max ${effectiveMortarCaliber}"` })
  if (ship.specialWeaponSlots > 0) positions.push({ key: 'special', label: 'Special', slots: ship.specialWeaponSlots })

  return (
    <div className="bg-background/50 rounded-lg p-4">
      <h4 className="text-sm font-medium text-accent mb-3">⚔️ Weapon Positions</h4>
      <div className="space-y-3">
        {positions.map(pos => {
          const posWeapons = loadout.weapons.filter(w => w.position === pos.key)
          const totalEquipped = posWeapons.reduce((sum, w) => sum + w.quantity, 0)
          const compatible = getCompatibleWeapons(weaponCatalog, ship, pos.key)

          return (
            <WeaponPositionRow
              key={pos.key}
              position={pos.key}
              label={pos.label}
              slots={pos.slots}
              note={pos.note}
              equipped={posWeapons}
              totalEquipped={totalEquipped}
              compatible={compatible}
              loadoutId={loadout.id}
              startTransition={startTransition}
            />
          )
        })}

        {/* Swivel guns (fixed) */}
        {ship.swivelGuns > 0 && (
          <div className="text-xs text-foreground-secondary">
            <span className="font-medium">Swivel Guns:</span> {ship.swivelGuns} (fixed, not changeable)
          </div>
        )}
      </div>
    </div>
  )
}

function WeaponPositionRow({ position, label, slots, note, equipped, totalEquipped, compatible, loadoutId, startTransition }: {
  position: string; label: string; slots: number; note?: string
  equipped: LoadoutWeapon[]; totalEquipped: number
  compatible: Weapon[]; loadoutId: string
  startTransition: (fn: () => void) => void
}) {
  const [selectedWeaponId, setSelectedWeaponId] = useState('')
  const [qty, setQty] = useState(1)
  const remaining = slots - totalEquipped

  function handleAdd() {
    if (!selectedWeaponId || remaining <= 0) return
    const addQty = Math.min(qty, remaining)
    startTransition(async () => {
      await addWeaponToLoadout(loadoutId, selectedWeaponId, position, addQty)
      setSelectedWeaponId('')
      setQty(1)
    })
  }

  if (slots === 0) return null

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-xs">
        <span className="font-medium text-foreground">{label}</span>
        {note && <span className="text-foreground-secondary/60">({note})</span>}
        <span className={`${remaining === 0 ? 'text-primary' : 'text-foreground-secondary'}`}>{totalEquipped} / {slots}</span>
      </div>

      {/* Equipped weapons */}
      {equipped.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {equipped.map(w => (
            <span key={w.id} className="inline-flex items-center gap-1 text-xs bg-surface rounded px-2 py-0.5 text-foreground">
              {w.weapon.name} x{w.quantity}
              {w.weapon.isPremium && <span className="text-accent">★</span>}
              <button
                onClick={() => startTransition(() => removeWeaponFromLoadout(w.id))}
                className="text-foreground-secondary hover:text-primary ml-1"
              >×</button>
            </span>
          ))}
        </div>
      )}

      {/* Add weapon */}
      {remaining > 0 && (
        <div className="flex gap-1 items-center">
          <select value={selectedWeaponId} onChange={e => setSelectedWeaponId(e.target.value)} className="flex-1 bg-surface border border-surface-border rounded px-2 py-1 text-xs text-foreground focus:border-accent focus:outline-none min-w-0">
            <option value="">Add weapon…</option>
            {compatible.map(w => (
              <option key={w.id} value={w.id}>
                {w.name} ({w.type}{w.penetration ? `, pen ${w.penetration}${w.penetrationMulti || ''}` : ''}{w.range ? `, ${w.range}m` : ''}{w.loading ? `, ${w.loading}s` : ''})
              </option>
            ))}
          </select>
          <input type="number" min={1} max={remaining} value={qty} onChange={e => setQty(Math.max(1, Math.min(remaining, parseInt(e.target.value) || 1)))} className="w-14 bg-surface border border-surface-border rounded px-2 py-1 text-xs text-foreground focus:border-accent focus:outline-none" />
          <button onClick={handleAdd} disabled={!selectedWeaponId} className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary-hover disabled:opacity-50">+</button>
        </div>
      )}
    </div>
  )
}

// ============================================================
// CREW PANEL
// ============================================================

// ============================================================
// CREW QUANTITY INPUT (local state, saves on blur/Enter)
// ============================================================

function CrewQuantityInput({ crewId, value, min, max, onSave }: {
  crewId: string; value: number; min: number; max: number
  onSave: (val: number) => void
}) {
  const [localVal, setLocalVal] = useState(String(value))
  const [lastSaved, setLastSaved] = useState(value)

  // Sync from server when value changes externally
  if (value !== lastSaved) {
    setLocalVal(String(value))
    setLastSaved(value)
  }

  function commit() {
    const parsed = parseInt(localVal)
    if (isNaN(parsed)) {
      setLocalVal(String(value))
      return
    }
    const clamped = Math.max(min, Math.min(max, parsed))
    setLocalVal(String(clamped))
    if (clamped !== value) {
      setLastSaved(clamped)
      onSave(clamped)
    }
  }

  return (
    <input
      type="number"
      min={min}
      max={max}
      value={localVal}
      onChange={e => setLocalVal(e.target.value)}
      onBlur={commit}
      onKeyDown={e => { if (e.key === 'Enter') { e.currentTarget.blur() } }}
      className="w-16 bg-surface border border-surface-border rounded px-2 py-1 text-foreground focus:border-accent focus:outline-none"
    />
  )
}

const PIRATE_CREW = ['Pirate Captain', 'Pirate Navigator', 'Pirate Gunner', 'Pirate Quartermaster', 'Pirate Bosun']
const MILITARY_CREW = ['Military Captain', 'Military Navigator', 'Military Gunner', 'Military Quartermaster', 'Military Bosun']

function CrewPanel({ ship, loadout, crewCatalog, modStats, startTransition }: {
  ship: Ship; loadout: Loadout; crewCatalog: Crew[]; modStats: ModifiedStats | null
  startTransition: (fn: () => void) => void
}) {
  const [selectedCrewId, setSelectedCrewId] = useState('')
  const basicCrewTypes = BASIC_CREW.map(name => crewCatalog.find(c => c.name === name)).filter((c): c is Crew => c != null)
  const specialCrewTypes = crewCatalog.filter(c => !BASIC_CREW.includes(c.name))

  const crewCapacity = modStats?.crewCapacity ?? ship.crewCapacity ?? 0
  const minSailors = Math.ceil(crewCapacity / 2)

  const basicCrew = loadout.crew.filter(c => BASIC_CREW.includes(c.crewType.name))
  const specialCrew = loadout.crew.filter(c => !BASIC_CREW.includes(c.crewType.name))
  const totalBasic = basicCrew.reduce((sum, c) => sum + c.quantity, 0)

  // Faction conflict detection
  const hasPirate = specialCrew.some(c => PIRATE_CREW.includes(c.crewType.name))
  const hasMilitary = specialCrew.some(c => MILITARY_CREW.includes(c.crewType.name))
  const factionConflict = hasPirate && hasMilitary

  // Available special crew (no duplicates, max 4 — default 3, +1 with "Right Hand" skill)
  const MAX_SPECIAL_CREW = 4
  const equippedSpecialIds = new Set(specialCrew.map(c => c.crewType.id))
  const availableSpecial = specialCrewTypes.filter(c => !equippedSpecialIds.has(c.id))

  function handleAddBasicCrew(crewTypeId: string, qty: number) {
    if (totalBasic + qty > crewCapacity) return
    startTransition(() => addCrewToLoadout(loadout.id, crewTypeId, qty))
  }

  function handleAddSpecialCrew() {
    if (!selectedCrewId || specialCrew.length >= MAX_SPECIAL_CREW) return
    startTransition(async () => {
      await addCrewToLoadout(loadout.id, selectedCrewId, 1)
      setSelectedCrewId('')
    })
  }

  return (
    <div className="bg-background/50 rounded-lg p-4">
      <h4 className="text-sm font-medium text-accent mb-3">👥 Crew</h4>

      {/* Basic Crew */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-foreground-secondary">Basic Crew</span>
          <span className={totalBasic > crewCapacity ? 'text-primary font-medium' : 'text-foreground-secondary'}>{totalBasic} / {crewCapacity}</span>
        </div>

        {basicCrewTypes.map(ct => {
          const existing = basicCrew.find(c => c.crewType.id === ct.id)
          const isSailor = ct.name === 'Sailor'

          return (
            <div key={ct.id} className="flex items-center gap-2 text-xs">
              <span className="w-24 text-foreground">{ct.name}</span>
              {isSailor && <span className="text-foreground-secondary/60">MIN: {minSailors}</span>}
              {existing ? (
                <div className="flex items-center gap-1">
                  <CrewQuantityInput
                    crewId={existing.id}
                    value={existing.quantity}
                    min={isSailor ? minSailors : 0}
                    max={crewCapacity - totalBasic + existing.quantity}
                    onSave={(val) => startTransition(() => updateCrewQuantity(existing.id, val))}
                  />
                  <button onClick={() => startTransition(() => removeCrewFromLoadout(existing.id))} className="text-foreground-secondary hover:text-primary">×</button>
                </div>
              ) : (
                <button
                  onClick={() => handleAddBasicCrew(ct.id, isSailor ? minSailors : 1)}
                  disabled={totalBasic >= crewCapacity}
                  className="px-2 py-0.5 border border-dashed border-surface-border text-foreground-secondary rounded hover:text-foreground disabled:opacity-30"
                >
                  + Add
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Special Crew */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-foreground-secondary">Special Crew</span>
          <span className="text-foreground-secondary">{specialCrew.length} / {MAX_SPECIAL_CREW}</span>
        </div>

        {factionConflict && (
          <div className="text-xs text-primary bg-primary/10 rounded px-2 py-1">
            ⚠️ Faction conflict: Pirates and Military crew don&apos;t mix well!
          </div>
        )}

        {specialCrew.map(c => (
          <div key={c.id} className="flex items-center justify-between text-xs">
            <span className="text-foreground">{c.crewType.name}</span>
            <button onClick={() => startTransition(() => removeCrewFromLoadout(c.id))} className="text-foreground-secondary hover:text-primary">×</button>
          </div>
        ))}

        {specialCrew.length < MAX_SPECIAL_CREW && (
          <div className="flex gap-1 items-center">
            <select value={selectedCrewId} onChange={e => setSelectedCrewId(e.target.value)} className="flex-1 bg-surface border border-surface-border rounded px-2 py-1 text-xs text-foreground focus:border-accent focus:outline-none">
              <option value="">Add special crew…</option>
              {availableSpecial.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <button onClick={handleAddSpecialCrew} disabled={!selectedCrewId} className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary-hover disabled:opacity-50">+</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================
// UPGRADES PANEL
// ============================================================

function UpgradesPanel({ ship, loadout, upgradeCatalog, startTransition }: {
  ship: Ship; loadout: Loadout; upgradeCatalog: Upgrade[]
  startTransition: (fn: () => void) => void
}) {
  const [selectedSailId, setSelectedSailId] = useState('')
  const [selectedUpgradeId, setSelectedUpgradeId] = useState('')

  // Split catalog into sails vs regular upgrades (DB slot field = category from game data)
  const isSail = (u: Upgrade) => u.slot === 'Sails' || u.slot === 'sail' || u.name.toLowerCase().includes('sails')
  const sailCatalog = upgradeCatalog.filter(isSail)
  const regularCatalog = upgradeCatalog.filter(u => {
    if (isSail(u)) return false
    // Only show Mortar Modification for compatible ships
    if (u.name === 'Mortar Fitted') {
      return ship.name in MORTAR_MOD_SHIPS
    }
    return true
  })

  // Split equipped upgrades
  const equippedSails = loadout.upgrades.filter(u => isSail(u.upgrade as Upgrade))
  const equippedRegular = loadout.upgrades.filter(u => !isSail(u.upgrade as Upgrade))

  return (
    <div className="space-y-4">
      {/* Sails Section */}
      <div className="bg-background/50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-accent mb-3">⛵ Sails</h4>
        {equippedSails.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {equippedSails.map(u => (
              <span key={u.id} className="inline-flex items-center gap-1 text-xs bg-surface rounded px-2 py-0.5 text-foreground">
                {u.upgrade.name}
                <button onClick={() => startTransition(() => removeUpgradeFromLoadout(u.id))} className="text-foreground-secondary hover:text-primary ml-1">×</button>
              </span>
            ))}
          </div>
        )}
        {equippedSails.length === 0 && (
          <div className="flex gap-1 items-center">
            <select value={selectedSailId} onChange={e => setSelectedSailId(e.target.value)} className="flex-1 bg-surface border border-surface-border rounded px-2 py-1 text-xs text-foreground focus:border-accent focus:outline-none">
              <option value="">Select sail…</option>
              {sailCatalog.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
            <button onClick={() => { if (selectedSailId) { startTransition(() => addUpgradeToLoadout(loadout.id, selectedSailId)); setSelectedSailId('') } }} disabled={!selectedSailId} className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary-hover disabled:opacity-50">+</button>
          </div>
        )}
        <p className="text-xs text-foreground-secondary/60 mt-1">1 sail slot per ship</p>
      </div>

      {/* Upgrades Section */}
      <div className="bg-background/50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-accent mb-3">🛡️ Upgrades</h4>
        {equippedRegular.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {equippedRegular.map(u => {
              const isMortarMod = u.upgrade.name === 'Mortar Fitted'
              return (
                <span key={u.id} className={`inline-flex items-center gap-1 text-xs rounded px-2 py-0.5 ${isMortarMod ? 'bg-accent/20 text-accent' : 'bg-surface text-foreground'}`}>
                  {u.upgrade.name}
                  {isMortarMod && <span>🎯</span>}
                  <button onClick={() => startTransition(() => removeUpgradeFromLoadout(u.id))} className="text-foreground-secondary hover:text-primary ml-1">×</button>
                </span>
              )
            })}
          </div>
        )}
        <div className="flex gap-1 items-center">
          <select value={selectedUpgradeId} onChange={e => setSelectedUpgradeId(e.target.value)} className="flex-1 bg-surface border border-surface-border rounded px-2 py-1 text-xs text-foreground focus:border-accent focus:outline-none">
            <option value="">Add upgrade…</option>
            {regularCatalog.map(u => (
              <option key={u.id} value={u.id}>{u.name}{u.slot ? ` (${u.slot})` : ''}</option>
            ))}
          </select>
          <button onClick={() => { if (selectedUpgradeId) { startTransition(() => addUpgradeToLoadout(loadout.id, selectedUpgradeId)); setSelectedUpgradeId('') } }} disabled={!selectedUpgradeId} className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary-hover disabled:opacity-50">+</button>
        </div>
        <p className="text-xs text-foreground-secondary/60 mt-1">4 upgrade slots + 1 special add-on slot (late-game)</p>
      </div>
    </div>
  )
}

// ============================================================
// AMMO PANEL
// ============================================================

function AmmoPanel({ loadout, ammoCatalog, startTransition }: {
  loadout: Loadout; ammoCatalog: Ammo[]
  startTransition: (fn: () => void) => void
}) {
  const [selectedId, setSelectedId] = useState('')
  const [qty, setQty] = useState(1)

  return (
    <div className="bg-background/50 rounded-lg p-4">
      <h4 className="text-sm font-medium text-accent mb-3">💣 Ammo</h4>
      {loadout.ammo.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {loadout.ammo.map(a => (
            <span key={a.id} className="inline-flex items-center gap-1 text-xs bg-surface rounded px-2 py-0.5 text-foreground">
              {a.ammoType.name} x{a.quantity}
              <button onClick={() => startTransition(() => removeAmmoFromLoadout(a.id))} className="text-foreground-secondary hover:text-primary ml-1">×</button>
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-1 items-center">
        <select value={selectedId} onChange={e => setSelectedId(e.target.value)} className="flex-1 bg-surface border border-surface-border rounded px-2 py-1 text-xs text-foreground focus:border-accent focus:outline-none">
          <option value="">Add ammo…</option>
          {ammoCatalog.map(a => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
        <input type="number" min={1} value={qty} onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))} className="w-14 bg-surface border border-surface-border rounded px-2 py-1 text-xs text-foreground focus:border-accent focus:outline-none" />
        <button onClick={() => { if (selectedId) { startTransition(() => addAmmoToLoadout(loadout.id, selectedId, qty)); setSelectedId(''); setQty(1) } }} disabled={!selectedId} className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary-hover disabled:opacity-50">+</button>
      </div>
    </div>
  )
}
