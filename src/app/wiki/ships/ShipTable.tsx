'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

interface WeaponSlots {
  stern: number
  broadside: number
  bow: number
}

interface Acquisition {
  type: string
  cost?: Record<string, number>
}

interface ChestSource {
  chest: string
  dropRate: number | null
  category: string
  categoryRate?: number
  categoryLabel?: string
}

interface Ship {
  gameId: number
  name: string
  description: string
  health: number
  speed: number
  mobility: number
  armor: number
  capacity: number
  crew: number
  rank: number
  gameType: string
  displayClass: string
  subtype: string
  coolness: string
  faction: string
  gameFaction: string
  extraUpgradeSlots: number
  costReal: number
  canBeNpc: boolean
  requiredRank: number
  canBeUsedForNpc: boolean
  // Extended stats
  broadsideArmor: number
  hold: number
  displacement: string
  integrity: number
  weaponSlots: WeaponSlots
  swivelGuns: number
  mortarSlots: number
  specialWeaponSlots: number
  role: string
  inGameClass: string
  inGameRate: number
  bonuses: string[]
  acquisition: Acquisition & { imperialChestOnly?: boolean }
  chestSources?: ChestSource[]
  craftingCost?: Record<string, number>
}

type SortKey = 'name' | 'health' | 'speed' | 'mobility' | 'armor' | 'capacity' | 'crew' | 'coolness' | 'rank'

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']

function shipRate(rank: number): string {
  return ROMAN_NUMERALS[rank] ?? `${rank + 1}`
}

function formatSubtype(subtype: string): string {
  return subtype
    .replace('subclass_', '')
    .replace(/^./, s => s.toUpperCase())
}

const COOLNESS_ORDER: Record<string, number> = {
  'Default': 0,
  'Default SailageLegend': 1,
  'Elite': 2,
  'Elite SailageLegend': 3,
  'Empire': 4,
  'Unique': 5,
  'Unique SailageLegend': 6,
}

const COOLNESS_COLORS: Record<string, string> = {
  'Default': 'text-foreground-secondary',
  'Default SailageLegend': 'text-foreground-secondary',
  'Elite': 'text-blue-400',
  'Elite SailageLegend': 'text-blue-400',
  'Empire': 'text-purple-400',
  'Unique': 'text-yellow-400',
  'Unique SailageLegend': 'text-yellow-400',
}

const CLASS_COLORS: Record<string, string> = {
  'Sloop': 'text-green-400',
  'Brigantine': 'text-blue-400',
  'Frigate': 'text-purple-400',
  'Battleship': 'text-orange-400',
  'Galleon': 'text-yellow-400',
  'Galley': 'text-cyan-400',
  'Steamship': 'text-red-400',
}

export default function ShipTable({ ships }: { ships: Ship[] }) {
  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState<string>('all')
  const [factionFilter, setFactionFilter] = useState<string>('all')
  const [rateFilter, setRateFilter] = useState<string>('all')
  const [sortKey, setSortKey] = useState<SortKey>('coolness')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [expanded, setExpanded] = useState<number | null>(null)

  const classes = useMemo(() => [...new Set(ships.map(s => s.displayClass))].sort(), [ships])
  const factions = useMemo(() => [...new Set(ships.map(s => s.faction).filter(Boolean))].sort(), [ships])
  const rates = useMemo(() => [...new Set(ships.map(s => s.rank))].sort(), [ships])

  const filtered = useMemo(() => {
    let result = ships
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q))
    }
    if (classFilter !== 'all') result = result.filter(s => s.displayClass === classFilter)
    if (factionFilter !== 'all') result = result.filter(s => s.faction === factionFilter)
    if (rateFilter !== 'all') result = result.filter(s => s.rank === parseInt(rateFilter))

    result.sort((a, b) => {
      if (sortKey === 'coolness') {
        const av = COOLNESS_ORDER[a.coolness] ?? 0
        const bv = COOLNESS_ORDER[b.coolness] ?? 0
        return sortDir === 'asc' ? av - bv : bv - av
      }
      const av = a[sortKey]
      const bv = b[sortKey]
      if (typeof av === 'string' && typeof bv === 'string') {
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      }
      return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number)
    })
    return result
  }, [ships, search, classFilter, factionFilter, sortKey, sortDir])

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir(key === 'name' ? 'asc' : 'desc') }
  }

  const sortIcon = (key: SortKey) => {
    if (sortKey !== key) return '↕'
    return sortDir === 'asc' ? '↑' : '↓'
  }

  const [showLegend, setShowLegend] = useState(false)

  return (
    <div>
      {/* Tier & Rate Legend */}
      <div className="mb-4">
        <button
          onClick={() => setShowLegend(!showLegend)}
          className="text-sm text-accent hover:text-accent-hover transition-colors"
        >
          {showLegend ? '▼' : '▶'} What do Rate and Tier mean?
        </button>
        {showLegend && (
          <div className="mt-2 bg-surface border border-surface-border rounded-xl p-4 grid gap-4 sm:grid-cols-2">
            <div>
              <h4 className="text-foreground font-semibold text-sm mb-2">⚓ Ship Rate (I–VII)</h4>
              <p className="text-foreground-secondary text-xs mb-2">
                Rate indicates a ship&apos;s size and power class, displayed as Roman numerals in-game.
                Rate I ships are the largest and most powerful. Rate VII are small starter vessels.
              </p>
              <p className="text-foreground-secondary text-xs">
                Rate also affects crafting build time — higher-rate (smaller) ships build faster.
              </p>
            </div>
            <div>
              <h4 className="text-foreground font-semibold text-sm mb-2">✨ Ship Tier</h4>
              <ul className="space-y-1 text-xs">
                <li><span className="text-foreground-secondary">Default</span> — Standard ships with normal crafting cost and build time</li>
                <li><span className="text-blue-400">Elite</span> — Premium ships, instant build, 25% higher crafting cost</li>
                <li><span className="text-purple-400">Empire</span> — Empire faction exclusive ships</li>
                <li><span className="text-yellow-400">Unique</span> — Premium ships, instant build, special acquisition</li>
                <li className="text-foreground-muted">⛵ = Sailage Legend variant</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search ships..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-accent w-64"
        />
        <select
          value={classFilter}
          onChange={e => setClassFilter(e.target.value)}
          className="bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
        >
          <option value="all">All Classes</option>
          {classes.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={factionFilter}
          onChange={e => setFactionFilter(e.target.value)}
          className="bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
        >
          <option value="all">All Factions</option>
          {factions.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <select
          value={rateFilter}
          onChange={e => setRateFilter(e.target.value)}
          className="bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
        >
          <option value="all">All Rates</option>
          {rates.map(r => <option key={r} value={r}>Rate {shipRate(r)}</option>)}
        </select>
        <span className="text-foreground-muted text-sm self-center ml-auto">
          {filtered.length} ship{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-surface-border rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface border-b border-surface-border text-foreground-secondary text-left">
              {([
                ['name', 'Name'],
                ['rank', 'Rate'],
                ['health', 'Durability'],
                ['speed', 'Speed (kn)'],
                ['mobility', 'Maneuver'],
                ['armor', 'Armor'],
                ['capacity', 'Cargo'],
                ['crew', 'Crew'],
                ['coolness', 'Tier'],
              ] as [SortKey, string][]).map(([key, label]) => (
                <th
                  key={key}
                  onClick={() => toggleSort(key)}
                  className="px-3 py-3 cursor-pointer hover:text-accent select-none whitespace-nowrap"
                >
                  {label} <span className="text-foreground-muted">{sortIcon(key)}</span>
                </th>
              ))}
              <th className="px-3 py-3">Class</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(ship => (
              <>
                <tr
                  key={ship.gameId}
                  onClick={() => setExpanded(expanded === ship.gameId ? null : ship.gameId)}
                  className="border-b border-surface-border hover:bg-surface-hover cursor-pointer transition-colors"
                >
                  <td className="px-3 py-2 font-medium">
                    <Link
                      href={`/wiki/ships/${toSlug(ship.name)}`}
                      className="text-foreground hover:text-accent transition-colors"
                      onClick={e => e.stopPropagation()}
                    >
                      {ship.name}
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-accent font-medium">{shipRate(ship.rank)}</td>
                  <td className="px-3 py-2 text-foreground-secondary">{ship.health.toLocaleString()}</td>
                  <td className="px-3 py-2 text-foreground-secondary">{ship.speed}</td>
                  <td className="px-3 py-2 text-foreground-secondary">{ship.mobility}</td>
                  <td className="px-3 py-2 text-foreground-secondary">{ship.armor}</td>
                  <td className="px-3 py-2 text-foreground-secondary">{ship.capacity.toLocaleString()}</td>
                  <td className="px-3 py-2 text-foreground-secondary">{ship.crew}</td>
                  <td className={`px-3 py-2 font-medium ${COOLNESS_COLORS[ship.coolness] ?? 'text-foreground-secondary'}`}>{ship.coolness.replace(' SailageLegend', ' ⛵')}</td>
                  <td className={`px-3 py-2 font-medium ${CLASS_COLORS[ship.displayClass] ?? 'text-foreground-secondary'}`}>
                    {ship.displayClass}
                  </td>
                </tr>
                {expanded === ship.gameId && (
                  <tr key={`${ship.gameId}-detail`} className="bg-surface">
                    <td colSpan={10} className="px-4 py-4">
                      {/* Description & Tags */}
                      {ship.description && (
                        <p className="text-foreground-secondary text-sm mb-3">{ship.description}</p>
                      )}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {ship.inGameClass && (
                          <span className="bg-surface-hover text-foreground-secondary text-xs px-2 py-1 rounded">
                            {ship.inGameClass}
                          </span>
                        )}
                        {ship.role && (
                          <span className="bg-surface-hover text-foreground-secondary text-xs px-2 py-1 rounded">
                            Role: {ship.role}
                          </span>
                        )}
                        {ship.faction && (
                          <span className="bg-surface-hover text-foreground-secondary text-xs px-2 py-1 rounded">
                            Faction: {ship.faction}
                          </span>
                        )}
                        {ship.displacement && (
                          <span className="bg-surface-hover text-foreground-secondary text-xs px-2 py-1 rounded">
                            ⚓ {ship.displacement}
                          </span>
                        )}
                        {ship.extraUpgradeSlots > 0 && (
                          <span className="bg-surface-hover text-accent text-xs px-2 py-1 rounded">
                            +{ship.extraUpgradeSlots} upgrade slot{ship.extraUpgradeSlots > 1 ? 's' : ''}
                          </span>
                        )}
                        {ship.canBeUsedForNpc && (
                          <span className="bg-surface-hover text-red-400 text-xs px-2 py-1 rounded">
                            NPC Hull
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Core Stats */}
                        <div>
                          <h4 className="text-foreground font-semibold text-xs uppercase mb-2">Core Stats</h4>
                          <div className="space-y-1">
                            {[
                              ['Durability', ship.health.toLocaleString()],
                              ['Speed', `${ship.speed} kn`],
                              ['Maneuverability', ship.mobility],
                              ['Broadside Armor', ship.broadsideArmor],
                              ['Hold', ship.hold.toLocaleString()],
                              ['Crew', ship.crew],
                              ['Integrity', ship.integrity],
                            ].map(([label, val]) => (
                              <div key={label as string} className="flex justify-between bg-surface-hover rounded px-2 py-1 text-sm">
                                <span className="text-foreground-muted">{label}</span>
                                <span className="text-foreground font-medium">{val}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Armament */}
                        <div>
                          <h4 className="text-foreground font-semibold text-xs uppercase mb-2">Armament</h4>
                          <div className="space-y-1">
                            {ship.weaponSlots && (
                              <>
                                <div className="flex justify-between bg-surface-hover rounded px-2 py-1 text-sm">
                                  <span className="text-foreground-muted">Broadside Guns</span>
                                  <span className="text-foreground font-medium">{ship.weaponSlots.broadside}</span>
                                </div>
                                <div className="flex justify-between bg-surface-hover rounded px-2 py-1 text-sm">
                                  <span className="text-foreground-muted">Stern Guns</span>
                                  <span className="text-foreground font-medium">{ship.weaponSlots.stern}</span>
                                </div>
                                <div className="flex justify-between bg-surface-hover rounded px-2 py-1 text-sm">
                                  <span className="text-foreground-muted">Bow Guns</span>
                                  <span className="text-foreground font-medium">{ship.weaponSlots.bow}</span>
                                </div>
                              </>
                            )}
                            <div className="flex justify-between bg-surface-hover rounded px-2 py-1 text-sm">
                              <span className="text-foreground-muted">Swivel Guns</span>
                              <span className="text-foreground font-medium">{ship.swivelGuns}</span>
                            </div>
                            {ship.mortarSlots > 0 && (
                              <div className="flex justify-between bg-surface-hover rounded px-2 py-1 text-sm">
                                <span className="text-foreground-muted">Mortar Slots</span>
                                <span className="text-foreground font-medium">{ship.mortarSlots}</span>
                              </div>
                            )}
                            {ship.specialWeaponSlots > 0 && (
                              <div className="flex justify-between bg-surface-hover rounded px-2 py-1 text-sm">
                                <span className="text-foreground-muted">Special Weapon Slots</span>
                                <span className="text-foreground font-medium">{ship.specialWeaponSlots}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Acquisition */}
                        <div>
                          <h4 className="text-foreground font-semibold text-xs uppercase mb-2">How to Get</h4>
                          <div className="space-y-2">
                            {ship.acquisition?.type === 'craftable' && (
                              <div className="bg-surface-hover rounded px-3 py-2">
                                <span className="text-green-400 text-sm font-medium">🔨 Craftable</span>
                                {ship.craftingCost && Object.keys(ship.craftingCost).length > 0 ? (
                                  <div className="mt-1">
                                    <span className="text-foreground-muted text-xs">Base crafting cost:</span>
                                    {Object.entries(ship.craftingCost).map(([resource, amount]) => (
                                      <div key={resource} className="flex justify-between text-sm mt-0.5">
                                        <span className="text-foreground-secondary">{resource}</span>
                                        <span className="text-accent font-medium">{amount.toLocaleString()}</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-foreground-muted text-xs mt-1">Built at the shipyard</p>
                                )}
                              </div>
                            )}
                            {ship.acquisition?.type === 'premium' && ship.acquisition.cost && (
                              <div className="bg-surface-hover rounded px-3 py-2">
                                <span className="text-yellow-400 text-sm font-medium">🪙 Premium Ship</span>
                                {Object.entries(ship.acquisition.cost).map(([currency, amount]) => (
                                  <div key={currency} className="flex justify-between text-sm mt-1">
                                    <span className="text-foreground-secondary">{currency}</span>
                                    <span className="text-accent font-medium">{(amount as number).toLocaleString()}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            {ship.acquisition?.type === 'unique' && ship.acquisition.cost && (
                              <div className="bg-surface-hover rounded px-3 py-2">
                                {ship.acquisition.imperialChestOnly ? (
                                  <>
                                    <span className="text-purple-400 text-sm font-medium">🎁 Imperial Chest Only</span>
                                    <p className="text-foreground-muted text-xs mt-1">Currently only available from Imperial Chests</p>
                                    <div className="mt-2 border-t border-surface-border pt-2">
                                      <span className="text-foreground-muted text-xs italic">Potential cost on full release:</span>
                                      {Object.entries(ship.acquisition.cost).map(([currency, amount]) => (
                                        <div key={currency} className="flex justify-between text-sm mt-1 opacity-60">
                                          <span className="text-foreground-secondary">{currency}</span>
                                          <span className="text-accent font-medium">{(amount as number).toLocaleString()}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <span className="text-yellow-400 text-sm font-medium">🏆 Unique Ship</span>
                                    {Object.entries(ship.acquisition.cost).map(([currency, amount]) => (
                                      <div key={currency} className="flex justify-between text-sm mt-1">
                                        <span className="text-foreground-secondary">{currency}</span>
                                        <span className="text-accent font-medium">{(amount as number).toLocaleString()}</span>
                                      </div>
                                    ))}
                                  </>
                                )}
                              </div>
                            )}
                            {ship.acquisition?.type === 'empire' && ship.acquisition.cost && (
                              <div className="bg-surface-hover rounded px-3 py-2">
                                <span className="text-purple-400 text-sm font-medium">🏰 Empire Ship</span>
                                {Object.entries(ship.acquisition.cost).map(([currency, amount]) => (
                                  <div key={currency} className="flex justify-between text-sm mt-1">
                                    <span className="text-foreground-secondary">{currency}</span>
                                    <span className="text-accent font-medium">{(amount as number).toLocaleString()}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            {ship.chestSources && ship.chestSources.length > 0 && (
                              <div className="bg-surface-hover rounded px-3 py-2">
                                <span className="text-cyan-400 text-sm font-medium">🎁 Available from Chests</span>
                                {ship.chestSources.map((cs, i) => (
                                  <div key={i} className="mt-1">
                                    <div className="flex justify-between text-sm">
                                      <span className="text-foreground-secondary">{cs.chest}</span>
                                      <span className="text-foreground-muted text-xs">
                                        {cs.dropRate != null ? `${cs.dropRate}%` : ''}
                                      </span>
                                    </div>
                                    {cs.categoryRate != null && (
                                      <div className="text-foreground-muted text-xs">
                                        {cs.categoryLabel}: {cs.categoryRate}% chance (shared)
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Bonuses */}
                          {ship.bonuses && ship.bonuses.length > 0 && (
                            <div className="mt-3">
                              <h4 className="text-foreground font-semibold text-xs uppercase mb-1">Ship Bonuses</h4>
                              <div className="space-y-1">
                                {ship.bonuses.map((bonus, i) => (
                                  <div key={i} className="bg-surface-hover rounded px-2 py-1 text-xs text-accent">
                                    ✨ {bonus}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
