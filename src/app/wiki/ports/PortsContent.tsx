'use client'

import { useState, useMemo } from 'react'

interface Port {
  gameId: string
  name: string
  type: string
  buildShipRanks: number
  flags: string
  fixedLevel: number
  producedResource: string
}

const TYPE_STYLES: Record<string, { icon: string; color: string; label: string }> = {
  City:       { icon: '🏰', color: 'text-amber-400', label: 'City' },
  Bay:        { icon: '⚓', color: 'text-blue-400', label: 'Bay' },
  NeutralBay: { icon: '🏳️', color: 'text-foreground-secondary', label: 'Neutral Bay' },
  PirateBay:  { icon: '🏴‍☠️', color: 'text-red-400', label: 'Pirate Bay' },
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']

function parseFlags(flags: string): string[] {
  if (!flags) return []
  return flags.split(' ').filter(Boolean).map(f =>
    f.replace(/([A-Z])/g, ' $1').trim()
  )
}

export default function PortsContent({ ports }: { ports: Port[] }) {
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [search, setSearch] = useState('')

  const types = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const p of ports) {
      counts[p.type] = (counts[p.type] || 0) + 1
    }
    return counts
  }, [ports])

  const filtered = useMemo(() => {
    let result = ports
    if (typeFilter !== 'all') result = result.filter(p => p.type === typeFilter)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.producedResource.toLowerCase().includes(q))
    }
    return result.sort((a, b) => a.name.localeCompare(b.name))
  }, [ports, typeFilter, search])

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-wrap gap-1 bg-surface border border-surface-border rounded-lg p-1">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
              typeFilter === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground-secondary hover:text-foreground hover:bg-surface-hover'
            }`}
          >
            All ({ports.length})
          </button>
          {Object.entries(types).sort().map(([type, count]) => {
            const style = TYPE_STYLES[type] || { icon: '📍', color: 'text-foreground-secondary', label: type }
            return (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  typeFilter === type
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground-secondary hover:text-foreground hover:bg-surface-hover'
                }`}
              >
                {style.icon} {style.label} ({count})
              </button>
            )
          })}
        </div>

        <input
          type="text"
          placeholder="Search ports..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-surface border border-surface-border rounded-lg px-3 py-1.5 text-sm text-foreground placeholder:text-foreground-muted w-48"
        />
      </div>

      {/* Port table */}
      <div className="bg-surface border border-surface-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border text-foreground-secondary text-xs">
                <th className="px-4 py-3 text-left">Port</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-center">Ship Rank</th>
                <th className="px-4 py-3 text-center">Level</th>
                <th className="px-4 py-3 text-left">Produces</th>
                <th className="px-4 py-3 text-left">Features</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(port => {
                const style = TYPE_STYLES[port.type] || { icon: '📍', color: 'text-foreground-secondary', label: port.type }
                const flags = parseFlags(port.flags)
                return (
                  <tr key={port.gameId} className="border-b border-surface-border hover:bg-surface-hover/50 transition-colors">
                    <td className="px-4 py-3 text-foreground font-medium">{port.name}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs ${style.color}`}>{style.icon} {style.label}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-accent font-semibold">
                        {port.buildShipRanks > 0 ? ROMAN[port.buildShipRanks - 1] || port.buildShipRanks : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-foreground-secondary">
                      {port.fixedLevel > 0 ? port.fixedLevel : '—'}
                    </td>
                    <td className="px-4 py-3">
                      {port.producedResource ? (
                        <span className="text-green-400 text-xs">{port.producedResource}</span>
                      ) : (
                        <span className="text-foreground-muted text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {flags.map(f => (
                          <span key={f} className="text-xs px-1.5 py-0.5 rounded bg-surface-hover text-foreground-muted">
                            {f}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-foreground-muted">No ports match the current filters.</div>
      )}
    </div>
  )
}
