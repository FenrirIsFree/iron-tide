'use client'

import { useState, useMemo } from 'react'

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
}

type SortKey = 'name' | 'health' | 'speed' | 'mobility' | 'armor' | 'capacity' | 'crew' | 'coolness'

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
  const [sortKey, setSortKey] = useState<SortKey>('coolness')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [expanded, setExpanded] = useState<number | null>(null)

  const classes = useMemo(() => [...new Set(ships.map(s => s.displayClass))].sort(), [ships])
  const factions = useMemo(() => [...new Set(ships.map(s => s.faction).filter(Boolean))].sort(), [ships])

  const filtered = useMemo(() => {
    let result = ships
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q))
    }
    if (classFilter !== 'all') result = result.filter(s => s.displayClass === classFilter)
    if (factionFilter !== 'all') result = result.filter(s => s.faction === factionFilter)

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

  return (
    <div>
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
                  <td className="px-3 py-2 font-medium text-foreground">{ship.name}</td>
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
                    <td colSpan={9} className="px-4 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-foreground-secondary text-sm mb-3">{ship.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {ship.faction && (
                              <span className="bg-surface-hover text-foreground-secondary text-xs px-2 py-1 rounded">
                                Faction: {ship.faction}
                              </span>
                            )}
                            {ship.subtype && (
                              <span className="bg-surface-hover text-foreground-secondary text-xs px-2 py-1 rounded">
                                Type: {formatSubtype(ship.subtype)}
                              </span>
                            )}
                            {ship.requiredRank > 0 && (
                              <span className="bg-surface-hover text-foreground-secondary text-xs px-2 py-1 rounded">
                                Requires Rank {ship.requiredRank}
                              </span>
                            )}
                            {ship.extraUpgradeSlots > 0 && (
                              <span className="bg-surface-hover text-accent text-xs px-2 py-1 rounded">
                                +{ship.extraUpgradeSlots} upgrade slot{ship.extraUpgradeSlots > 1 ? 's' : ''}
                              </span>
                            )}
                            {ship.costReal > 0 && (
                              <span className="bg-surface-hover text-yellow-400 text-xs px-2 py-1 rounded">
                                💎 Premium ({ship.costReal} gems)
                              </span>
                            )}
                            {ship.canBeUsedForNpc && (
                              <span className="bg-surface-hover text-red-400 text-xs px-2 py-1 rounded">
                                NPC Hull
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="bg-surface-hover rounded p-2">
                            <span className="text-foreground-muted">Durability</span>
                            <span className="text-foreground float-right font-medium">{ship.health.toLocaleString()}</span>
                          </div>
                          <div className="bg-surface-hover rounded p-2">
                            <span className="text-foreground-muted">Speed</span>
                            <span className="text-foreground float-right font-medium">{ship.speed} kn</span>
                          </div>
                          <div className="bg-surface-hover rounded p-2">
                            <span className="text-foreground-muted">Maneuverability</span>
                            <span className="text-foreground float-right font-medium">{ship.mobility}</span>
                          </div>
                          <div className="bg-surface-hover rounded p-2">
                            <span className="text-foreground-muted">Armor</span>
                            <span className="text-foreground float-right font-medium">{ship.armor}</span>
                          </div>
                          <div className="bg-surface-hover rounded p-2">
                            <span className="text-foreground-muted">Cargo</span>
                            <span className="text-foreground float-right font-medium">{ship.capacity.toLocaleString()}</span>
                          </div>
                          <div className="bg-surface-hover rounded p-2">
                            <span className="text-foreground-muted">Crew</span>
                            <span className="text-foreground float-right font-medium">{ship.crew}</span>
                          </div>
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
