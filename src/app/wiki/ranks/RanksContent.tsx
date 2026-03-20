'use client'

import { useMemo } from 'react'

interface Rank {
  rank: number
  xpRequired: number
}

interface RanksContentProps {
  ranks: Rank[]
  shipsByRank: Record<number, string[]>
  skillsByRank: Record<number, string[]>
}

export default function RanksContent({ ranks, shipsByRank, skillsByRank }: RanksContentProps) {
  // Sort ranks from highest (29 = beginner) to lowest (1 = max)
  // Actually rank 29 has lowest XP so it's the starting rank
  const sorted = useMemo(() => {
    return [...ranks].sort((a, b) => b.rank - a.rank)
  }, [ranks])

  // Cumulative XP
  const cumulative = useMemo(() => {
    let total = 0
    const map: Record<number, number> = {}
    for (const r of sorted) {
      total += r.xpRequired
      map[r.rank] = total
    }
    return map
  }, [sorted])

  const maxXp = Math.max(...ranks.map(r => r.xpRequired))

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-surface border border-surface-border rounded-xl p-4 text-center">
          <span className="text-accent text-2xl font-bold">{ranks.length}</span>
          <p className="text-foreground-secondary text-xs mt-1">Total Ranks</p>
        </div>
        <div className="bg-surface border border-surface-border rounded-xl p-4 text-center">
          <span className="text-accent text-2xl font-bold">{cumulative[sorted[sorted.length - 1]?.rank]?.toLocaleString() || '—'}</span>
          <p className="text-foreground-secondary text-xs mt-1">Total XP to Max</p>
        </div>
        <div className="bg-surface border border-surface-border rounded-xl p-4 text-center">
          <span className="text-accent text-2xl font-bold">{Object.values(shipsByRank).flat().length}</span>
          <p className="text-foreground-secondary text-xs mt-1">Rank-Gated Ships</p>
        </div>
      </div>

      {/* Rank table */}
      <div className="bg-surface border border-surface-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border text-foreground-secondary text-xs">
                <th className="px-4 py-3 text-left">Rank</th>
                <th className="px-4 py-3 text-right">XP Required</th>
                <th className="px-4 py-3 text-right">Cumulative XP</th>
                <th className="px-4 py-3 text-left">XP Bar</th>
                <th className="px-4 py-3 text-left">Unlocks</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(rank => {
                const ships = shipsByRank[rank.rank] || []
                const skills = skillsByRank[rank.rank] || []
                const pct = maxXp > 0 ? (rank.xpRequired / maxXp) * 100 : 0
                const hasUnlocks = ships.length > 0 || skills.length > 0

                return (
                  <tr
                    key={rank.rank}
                    className={`border-b border-surface-border transition-colors ${
                      hasUnlocks ? 'bg-surface-hover/30' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <span className="text-accent font-bold text-lg">{rank.rank}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-foreground">
                      {rank.xpRequired.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-foreground-secondary">
                      {cumulative[rank.rank]?.toLocaleString() || '—'}
                    </td>
                    <td className="px-4 py-3 w-40">
                      <div className="h-2 bg-surface-hover rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-accent"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {ships.map(name => (
                          <span key={name} className="text-xs px-2 py-0.5 rounded-full bg-blue-900/30 text-blue-400 border border-blue-800">
                            🚢 {name}
                          </span>
                        ))}
                        {skills.map(name => (
                          <span key={name} className="text-xs px-2 py-0.5 rounded-full bg-purple-900/30 text-purple-400 border border-purple-800">
                            🧭 {name}
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
    </div>
  )
}
