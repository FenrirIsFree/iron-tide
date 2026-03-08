'use client'

import { useState, useMemo } from 'react'

interface Weapon {
  gameId: number
  name: string
  description: string
  class: string
  category: string
  distance: number
  penetration: number
  cooldown: number
  angle: number
  scatter: number
  extra: string
  craftingType: string
  price: number
  icon: string
}

type SortKey = 'name' | 'distance' | 'penetration' | 'cooldown' | 'angle' | 'scatter' | 'price'

function formatExtra(extra: string): string[] {
  if (!extra) return []
  return extra.split(';').map(part => {
    const [key, val] = part.split(':')
    switch (key) {
      case 'SpeedFactor': return `Ball Speed: ×${val}`
      case 'SplashRadius': return `Splash: ${val}m`
      case 'Preparation': return `Prep: ${(parseFloat(val) * 100).toFixed(0)}%`
      case 'UntilOverheat': return `Overheat: ${val} shots`
      default: return `${key}: ${val}`
    }
  })
}

function formatClass(cls: string): string {
  return cls
    .replace('Bombardier ', '')
    .replace('DistanceCannon ', '')
    .replace('HeavyCannon ', '')
    .replace('LiteCannon ', '')
    .replace('Mortar ', '')
    .replace('Special ', '')
    .replace('Default', 'Standard')
    .replace('Factory', 'Factory-built')
}

function formatCrafting(type: string): string {
  switch (type) {
    case 'ByCraft': return 'Craftable'
    case 'ByGold': return 'Buy with Gold'
    case 'NotAvailable': return 'Not Available'
    default: return type
  }
}

const CATEGORY_COLORS: Record<string, string> = {
  'Heavy Bronze': 'text-orange-400',
  'Heavy Iron': 'text-orange-300',
  'Medium Bronze': 'text-yellow-400',
  'Medium Iron': 'text-yellow-300',
  'Medium CastIron': 'text-yellow-200',
  'Light Bronze': 'text-green-400',
  'Light Iron': 'text-green-300',
  'Light CastIron': 'text-green-200',
  'Mortar': 'text-purple-400',
  'Mortar Factory': 'text-purple-300',
}

export default function WeaponTable({ weapons }: { weapons: Weapon[] }) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [classFilter, setClassFilter] = useState<string>('all')
  const [sortKey, setSortKey] = useState<SortKey>('penetration')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [expanded, setExpanded] = useState<number | null>(null)

  const categories = useMemo(() => [...new Set(weapons.map(w => w.category).filter(Boolean))].sort(), [weapons])
  const classes = useMemo(() => [...new Set(weapons.map(w => w.class).filter(Boolean))].sort(), [weapons])

  const filtered = useMemo(() => {
    let result = weapons
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(w => w.name.toLowerCase().includes(q) || w.description.toLowerCase().includes(q))
    }
    if (categoryFilter !== 'all') result = result.filter(w => w.category === categoryFilter)
    if (classFilter !== 'all') result = result.filter(w => w.class === classFilter)

    result.sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      if (typeof av === 'string' && typeof bv === 'string') {
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      }
      return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number)
    })
    return result
  }, [weapons, search, categoryFilter, classFilter, sortKey, sortDir])

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
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search weapons..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-accent w-64"
        />
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
        >
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={classFilter}
          onChange={e => setClassFilter(e.target.value)}
          className="bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
        >
          <option value="all">All Classes</option>
          {classes.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <span className="text-foreground-muted text-sm self-center ml-auto">
          {filtered.length} weapon{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="overflow-x-auto border border-surface-border rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface border-b border-surface-border text-foreground-secondary text-left">
              {([
                ['name', 'Name'],
                ['penetration', 'Damage'],
                ['distance', 'Range'],
                ['cooldown', 'Reload'],
                ['angle', 'Angle'],
                ['scatter', 'Scatter'],
                ['price', 'Price'],
              ] as [SortKey, string][]).map(([key, label]) => (
                <th
                  key={key}
                  onClick={() => toggleSort(key)}
                  className="px-3 py-3 cursor-pointer hover:text-accent select-none whitespace-nowrap"
                >
                  {label} <span className="text-foreground-muted">{sortIcon(key)}</span>
                </th>
              ))}
              <th className="px-3 py-3">Category</th>
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
                  <td className="px-3 py-2 font-medium text-foreground">{w.name}</td>
                  <td className="px-3 py-2 text-red-400 font-medium">{w.penetration}</td>
                  <td className="px-3 py-2 text-foreground-secondary">{w.distance}</td>
                  <td className="px-3 py-2 text-foreground-secondary">{w.cooldown}s</td>
                  <td className="px-3 py-2 text-foreground-secondary">{w.angle}°</td>
                  <td className="px-3 py-2 text-foreground-secondary">{w.scatter}</td>
                  <td className="px-3 py-2 text-accent">{w.price > 0 ? w.price.toLocaleString() : '—'}</td>
                  <td className={`px-3 py-2 font-medium ${CATEGORY_COLORS[w.category] ?? 'text-foreground-secondary'}`}>
                    {w.category}
                  </td>
                  <td className="px-3 py-2 text-foreground-secondary">{w.class}</td>
                </tr>
                {expanded === w.gameId && (
                  <tr key={`${w.gameId}-detail`} className="bg-surface">
                    <td colSpan={9} className="px-4 py-4">
                      {w.description && (
                        <p className="text-foreground-secondary text-sm mb-3">{w.description}</p>
                      )}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {w.extra && formatExtra(w.extra).map((text, i) => (
                          <span key={i} className="bg-surface-hover text-cyan-400 text-xs px-2 py-1 rounded">
                            {text}
                          </span>
                        ))}
                        {w.craftingType && (
                          <span className="bg-surface-hover text-foreground-secondary text-xs px-2 py-1 rounded">
                            {formatCrafting(w.craftingType)}
                          </span>
                        )}
                        <span className="bg-surface-hover text-foreground-secondary text-xs px-2 py-1 rounded">
                          Type: {formatClass(w.class)}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-3 text-sm">
                        <div className="bg-surface-hover rounded p-2">
                          <span className="text-foreground-muted block text-xs">Damage</span>
                          <span className="text-foreground font-medium">{w.penetration}</span>
                        </div>
                        <div className="bg-surface-hover rounded p-2">
                          <span className="text-foreground-muted block text-xs">Range</span>
                          <span className="text-foreground font-medium">{w.distance}</span>
                        </div>
                        <div className="bg-surface-hover rounded p-2">
                          <span className="text-foreground-muted block text-xs">Reload</span>
                          <span className="text-foreground font-medium">{w.cooldown}s</span>
                        </div>
                        <div className="bg-surface-hover rounded p-2">
                          <span className="text-foreground-muted block text-xs">Angle</span>
                          <span className="text-foreground font-medium">{w.angle}°</span>
                        </div>
                        <div className="bg-surface-hover rounded p-2">
                          <span className="text-foreground-muted block text-xs">Scatter</span>
                          <span className="text-foreground font-medium">{w.scatter}</span>
                        </div>
                        <div className="bg-surface-hover rounded p-2">
                          <span className="text-foreground-muted block text-xs">DPS</span>
                          <span className="text-foreground font-medium">{w.cooldown > 0 ? (w.penetration / w.cooldown).toFixed(1) : '—'}</span>
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
