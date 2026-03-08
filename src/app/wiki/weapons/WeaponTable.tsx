'use client'

import { useState, useMemo } from 'react'

interface Weapon {
  name: string
  gameId: string
  type: string
  weightClass: string
  damage: number
  damageDisplay: string
  reload: number
  range: number
  rangeMin?: number
  angle: number
  scatter: number
  dps: number
  projectileSpeed: number
  splashRadius?: number
  overheat?: number
  preparation?: number
  structureDamage?: string
  placementRestriction?: string
  shots: number
  acquisition: string
  price: number
  isPremium: boolean
  craftingRecipe?: Record<string, number>
  description: string
  icon: string
}

type SortKey = 'name' | 'damage' | 'dps' | 'range' | 'reload' | 'angle' | 'scatter' | 'price'

const TYPE_COLORS: Record<string, string> = {
  'Cannon': 'text-blue-400',
  'Long Cannon': 'text-cyan-400',
  'Carronade': 'text-orange-400',
  'Bombard': 'text-purple-400',
  'Mortar': 'text-red-400',
  'Special': 'text-yellow-400',
}

const WEIGHT_LABELS: Record<string, string> = {
  'Light': '🟢 Light',
  'Medium': '🟡 Medium',
  'Heavy': '🔴 Heavy',
  'Mortar': '💣 Mortar',
}

const ACQ_COLORS: Record<string, string> = {
  'Craftable': 'text-green-400',
  'Gold Purchase': 'text-accent',
  'Premium': 'text-purple-400',
}

function speedLabel(speed: number): string {
  if (speed >= 1.2) return 'Very Fast'
  if (speed > 1.0) return 'Fast'
  if (speed === 1.0) return 'Normal'
  if (speed >= 0.8) return 'Slow'
  return 'Very Slow'
}

export default function WeaponTable({ weapons }: { weapons: Weapon[] }) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [weightFilter, setWeightFilter] = useState<string>('all')
  const [acqFilter, setAcqFilter] = useState<string>('all')
  const [sortKey, setSortKey] = useState<SortKey>('dps')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [expanded, setExpanded] = useState<string | null>(null)

  const types = useMemo(() => [...new Set(weapons.map(w => w.type))].sort(), [weapons])
  const weights = useMemo(() => {
    const order = ['Light', 'Medium', 'Heavy', 'Mortar']
    return [...new Set(weapons.map(w => w.weightClass))].sort((a, b) => order.indexOf(a) - order.indexOf(b))
  }, [weapons])

  const filtered = useMemo(() => {
    let result = weapons
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(w =>
        w.name.toLowerCase().includes(q) ||
        w.type.toLowerCase().includes(q) ||
        w.description.toLowerCase().includes(q)
      )
    }
    if (typeFilter !== 'all') result = result.filter(w => w.type === typeFilter)
    if (weightFilter !== 'all') result = result.filter(w => w.weightClass === weightFilter)
    if (acqFilter !== 'all') result = result.filter(w => w.acquisition === acqFilter)

    result = [...result].sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      if (typeof av === 'string' && typeof bv === 'string') {
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      }
      return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number)
    })
    return result
  }, [weapons, search, typeFilter, weightFilter, acqFilter, sortKey, sortDir])

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
          placeholder="Search weapons..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-accent w-64"
        />
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
        >
          <option value="all">All Types</option>
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select
          value={weightFilter}
          onChange={e => setWeightFilter(e.target.value)}
          className="bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
        >
          <option value="all">All Weight Classes</option>
          {weights.map(w => <option key={w} value={w}>{w}</option>)}
        </select>
        <select
          value={acqFilter}
          onChange={e => setAcqFilter(e.target.value)}
          className="bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
        >
          <option value="all">All Sources</option>
          <option value="Gold Purchase">Gold Purchase</option>
          <option value="Craftable">Craftable</option>
          <option value="Premium">Premium</option>
        </select>
        <span className="text-foreground-muted text-sm self-center ml-auto">
          {filtered.length} weapon{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Legend */}
      <div className="mb-4 flex flex-wrap gap-4 text-xs text-foreground-muted">
        <span className="flex items-center gap-1">
          <span className="text-blue-400">●</span> Cannon
        </span>
        <span className="flex items-center gap-1">
          <span className="text-cyan-400">●</span> Long Cannon
        </span>
        <span className="flex items-center gap-1">
          <span className="text-orange-400">●</span> Carronade
        </span>
        <span className="flex items-center gap-1">
          <span className="text-purple-400">●</span> Bombard
        </span>
        <span className="flex items-center gap-1">
          <span className="text-red-400">●</span> Mortar
        </span>
        <span className="flex items-center gap-1">
          <span className="text-yellow-400">●</span> Special
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-surface-border rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface border-b border-surface-border text-foreground-secondary text-left">
              {([
                ['name', 'Name'],
                ['damage', 'Damage'],
                ['dps', 'DPS'],
                ['range', 'Range'],
                ['reload', 'Reload'],
                ['angle', 'Arc'],
                ['scatter', 'Spread'],
                ['price', 'Gold Cost'],
              ] as [SortKey, string][]).map(([key, label]) => (
                <th
                  key={key}
                  onClick={() => toggleSort(key)}
                  className="px-3 py-3 cursor-pointer hover:text-accent select-none whitespace-nowrap"
                >
                  {label} <span className="text-foreground-muted">{sortIcon(key)}</span>
                </th>
              ))}
              <th className="px-3 py-3">Type</th>
              <th className="px-3 py-3">Class</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(w => (
              <>
                <tr
                  key={w.gameId}
                  onClick={() => setExpanded(expanded === w.gameId ? null : w.gameId)}
                  className="border-b border-surface-border hover:bg-surface-hover cursor-pointer transition-colors"
                >
                  <td className="px-3 py-2 font-medium text-foreground">
                    {w.name}
                    {w.isPremium && <span className="ml-1 text-yellow-400 text-xs" title="Premium">⭐</span>}
                  </td>
                  <td className="px-3 py-2 text-red-400 font-medium">{w.damageDisplay}</td>
                  <td className="px-3 py-2 text-accent font-medium">{w.dps.toFixed(1)}</td>
                  <td className="px-3 py-2 text-foreground-secondary">
                    {w.rangeMin ? `${w.rangeMin}–${w.range}` : w.range}
                  </td>
                  <td className="px-3 py-2 text-foreground-secondary">{w.reload}s</td>
                  <td className="px-3 py-2 text-foreground-secondary">{w.angle}°</td>
                  <td className="px-3 py-2 text-foreground-secondary">{w.scatter}</td>
                  <td className="px-3 py-2 text-foreground-secondary">
                    {w.price > 0 ? w.price.toLocaleString() : '—'}
                  </td>
                  <td className={`px-3 py-2 font-medium whitespace-nowrap ${TYPE_COLORS[w.type] ?? 'text-foreground-secondary'}`}>
                    {w.type}
                  </td>
                  <td className="px-3 py-2 text-foreground-secondary whitespace-nowrap">
                    {WEIGHT_LABELS[w.weightClass] ?? w.weightClass}
                  </td>
                </tr>
                {expanded === w.gameId && (
                  <tr key={`${w.gameId}-detail`} className="bg-surface">
                    <td colSpan={10} className="px-4 py-4">
                      {w.description && (
                        <p className="text-foreground-secondary text-sm mb-3 italic">{w.description}</p>
                      )}

                      {/* Stat cards */}
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-3">
                        <StatCard label="Damage" value={w.damageDisplay} />
                        <StatCard label="DPS" value={w.dps.toFixed(1)} />
                        <StatCard label="Range" value={w.rangeMin ? `${w.rangeMin}–${w.range}` : String(w.range)} />
                        <StatCard label="Reload" value={`${w.reload}s`} />
                        <StatCard label="Firing Arc" value={`${w.angle}°`} />
                        <StatCard label="Spread" value={String(w.scatter)} />
                      </div>

                      {/* Extra info tags */}
                      <div className="flex flex-wrap gap-2">
                        <Tag label="Ball Speed" value={speedLabel(w.projectileSpeed)} />
                        {w.shots > 1 && <Tag label="Shots" value={`${w.shots} per volley`} />}
                        {w.splashRadius && <Tag label="Splash Radius" value={String(w.splashRadius)} />}
                        {w.overheat && <Tag label="Overheat" value={`${w.overheat} shots`} />}
                        {w.structureDamage && <Tag label="Structure Damage" value={w.structureDamage} />}
                        {w.placementRestriction && <Tag label="Placement" value={w.placementRestriction} />}
                        <span className={`text-xs px-2 py-1 rounded bg-surface-hover ${ACQ_COLORS[w.acquisition] ?? 'text-foreground-secondary'}`}>
                          {w.acquisition === 'Gold Purchase' && `Buy with Gold: ${w.price.toLocaleString()}`}
                          {w.acquisition === 'Premium' && `Premium (Coins): ${w.price.toLocaleString()}`}
                          {w.acquisition === 'Craftable' && 'Craftable'}
                        </span>
                        {w.craftingRecipe && Object.keys(w.craftingRecipe).length > 0 && (
                          <div className="w-full mt-2 bg-surface-hover rounded p-3">
                            <span className="text-foreground-muted text-xs block mb-1">⚒️ Crafting Cost</span>
                            <div className="flex flex-wrap gap-3">
                              {Object.entries(w.craftingRecipe).map(([res, amt]) => (
                                <span key={res} className="text-sm text-foreground">
                                  <span className="text-accent font-medium">{amt.toLocaleString()}</span>{' '}
                                  <span className="text-foreground-secondary">{res}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
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

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-hover rounded p-2">
      <span className="text-foreground-muted block text-xs">{label}</span>
      <span className="text-foreground font-medium">{value}</span>
    </div>
  )
}

function Tag({ label, value }: { label: string; value: string }) {
  return (
    <span className="bg-surface-hover text-cyan-400 text-xs px-2 py-1 rounded">
      {label}: {value}
    </span>
  )
}
