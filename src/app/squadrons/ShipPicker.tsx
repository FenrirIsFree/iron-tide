'use client'

import { useState, useMemo } from 'react'

type GuildShip = {
  id: string
  user: { id: string; username: string }
  ship: { id: string; name: string; rate: number; shipClass?: string; hp?: number | null; broadsideSlots?: number | null; speed?: number | null }
  loadouts: { id: string; isActive: boolean }[]
}

interface ShipPickerProps {
  availableShips: GuildShip[]
  onAdd: (shipId: string) => void
  onClose: () => void
  isPending: boolean
}

export default function ShipPicker({ availableShips, onAdd, onClose, isPending }: ShipPickerProps) {
  const [search, setSearch] = useState('')
  const [memberFilter, setMemberFilter] = useState<string>('all')
  const [rateFilter, setRateFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'rate' | 'name' | 'player' | 'hp'>('rate')

  // Unique members and rates for filter dropdowns
  const members = useMemo(() => {
    const m = new Map<string, string>()
    availableShips.forEach(s => m.set(s.user.id, s.user.username))
    return Array.from(m.entries()).sort((a, b) => a[1].localeCompare(b[1]))
  }, [availableShips])

  const rates = useMemo(() => {
    const r = new Set<number>()
    availableShips.forEach(s => r.add(s.ship.rate))
    return Array.from(r).sort((a, b) => a - b)
  }, [availableShips])

  // Filter and sort
  const filtered = useMemo(() => {
    let ships = availableShips

    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      ships = ships.filter(s =>
        s.ship.name.toLowerCase().includes(q) ||
        s.user.username.toLowerCase().includes(q)
      )
    }

    // Member filter
    if (memberFilter !== 'all') {
      ships = ships.filter(s => s.user.id === memberFilter)
    }

    // Rate filter
    if (rateFilter !== 'all') {
      ships = ships.filter(s => s.ship.rate === Number(rateFilter))
    }

    // Sort
    ships = [...ships].sort((a, b) => {
      switch (sortBy) {
        case 'rate': return a.ship.rate - b.ship.rate
        case 'name': return a.ship.name.localeCompare(b.ship.name)
        case 'player': return a.user.username.localeCompare(b.user.username)
        case 'hp': return (b.ship.hp ?? 0) - (a.ship.hp ?? 0)
        default: return 0
      }
    })

    return ships
  }, [availableShips, search, memberFilter, rateFilter, sortBy])

  return (
    <div className="border-b border-surface-border bg-background/50">
      {/* Search + Filters Bar */}
      <div className="px-5 py-3 flex flex-wrap gap-2 items-center border-b border-surface-border">
        <div className="relative flex-1 min-w-[200px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-secondary text-sm">🔍</span>
          <input
            autoFocus
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search ships or players…"
            className="w-full bg-surface border border-surface-border rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-foreground-secondary/50 focus:border-accent focus:outline-none"
          />
        </div>

        <select
          value={memberFilter}
          onChange={e => setMemberFilter(e.target.value)}
          className="bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
        >
          <option value="all">All Members</option>
          {members.map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>

        <select
          value={rateFilter}
          onChange={e => setRateFilter(e.target.value)}
          className="bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
        >
          <option value="all">All Rates</option>
          {rates.map(r => (
            <option key={r} value={r}>Rate {r}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as typeof sortBy)}
          className="bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
        >
          <option value="rate">Sort: Rate</option>
          <option value="name">Sort: Ship Name</option>
          <option value="player">Sort: Player</option>
          <option value="hp">Sort: HP</option>
        </select>

        <button
          onClick={onClose}
          className="px-3 py-2 text-sm text-foreground-secondary hover:text-foreground transition-colors"
        >
          ✕ Close
        </button>
      </div>

      {/* Results */}
      <div className="px-5 py-3">
        {filtered.length === 0 ? (
          <p className="text-foreground-secondary text-sm text-center py-4">
            {availableShips.length === 0 ? 'No ships available — all guild ships are already in this squadron.' : 'No ships match your filters.'}
          </p>
        ) : (
          <>
            <p className="text-xs text-foreground-secondary mb-2">{filtered.length} ship{filtered.length !== 1 ? 's' : ''} available</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-[320px] overflow-y-auto pr-1">
              {filtered.map(ship => (
                <button
                  key={ship.id}
                  onClick={() => onAdd(ship.id)}
                  disabled={isPending}
                  className="group bg-surface border border-surface-border rounded-lg p-3 text-left hover:border-accent hover:bg-surface/80 transition-all disabled:opacity-50"
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-xs font-medium text-accent">Rate {ship.ship.rate}</span>
                    <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">+ Add</span>
                  </div>
                  <p className="text-sm font-medium text-foreground truncate">{ship.ship.name}</p>
                  <p className="text-xs text-foreground-secondary truncate">{ship.user.username}</p>
                  <div className="flex gap-2 mt-1.5 text-xs text-foreground-secondary">
                    {ship.ship.hp != null && <span>{ship.ship.hp} HP</span>}
                    {ship.ship.broadsideSlots != null && <span>{ship.ship.broadsideSlots} BS</span>}
                    {ship.ship.speed != null && <span>Spd {ship.ship.speed}</span>}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
