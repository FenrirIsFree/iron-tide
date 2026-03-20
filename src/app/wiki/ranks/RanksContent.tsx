'use client'

import { useMemo } from 'react'

interface Rank {
  rank: number
  xpRequired: number
  legend?: boolean
}

interface RanksContentProps {
  ranks: Rank[]
}

export default function RanksContent({ ranks }: RanksContentProps) {
  // Sort ranks ascending (1 = start, 30 = max)
  const sorted = useMemo(() => {
    return [...ranks].sort((a, b) => a.rank - b.rank)
  }, [ranks])

  // Cumulative XP to reach each rank
  const cumulative = useMemo(() => {
    let total = 0
    const map: Record<number, number> = {}
    for (const r of sorted) {
      total += r.xpRequired
      map[r.rank] = total
    }
    return map
  }, [sorted])

  const maxXp = Math.max(...ranks.filter(r => !r.legend).map(r => r.xpRequired))
  const totalXp = Object.values(cumulative).reduce((a, b) => Math.max(a, b), 0)

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-surface border border-surface-border rounded-xl p-4 text-center">
          <span className="text-accent text-2xl font-bold">{ranks.length}</span>
          <p className="text-foreground-secondary text-xs mt-1">Total Ranks</p>
        </div>
        <div className="bg-surface border border-surface-border rounded-xl p-4 text-center">
          <span className="text-accent text-2xl font-bold">{totalXp.toLocaleString()}</span>
          <p className="text-foreground-secondary text-xs mt-1">Total XP to Max Rank</p>
        </div>
        <div className="bg-surface border border-surface-border rounded-xl p-4 text-center">
          <span className="text-purple-400 text-2xl font-bold">30</span>
          <p className="text-foreground-secondary text-xs mt-1">Legend Skills Unlock</p>
        </div>
      </div>

      {/* Info box */}
      <div className="bg-surface border border-surface-border rounded-xl p-5 text-sm text-foreground-secondary space-y-2">
        <p>Players start at <span className="text-accent font-semibold">Rank 1</span> and progress to <span className="text-accent font-semibold">Rank 30</span> by earning XP through combat, voyages, and missions.</p>
        <p>Reaching Rank 30 unlocks the <span className="text-purple-400 font-semibold">Legend</span> skill tree, granting access to powerful late-game abilities.</p>
        <p className="text-foreground-muted">Note: Ships are unlocked through their own <strong>class research trees</strong>, not player rank. See the Ships page for class progression details.</p>
      </div>

      {/* Rank table */}
      <div className="bg-surface border border-surface-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border text-foreground-secondary text-xs">
                <th className="px-4 py-3 text-left">Rank</th>
                <th className="px-4 py-3 text-right">XP to Next</th>
                <th className="px-4 py-3 text-right">Cumulative XP</th>
                <th className="px-4 py-3 text-left">Progress</th>
                <th className="px-4 py-3 text-left">Note</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(rank => {
                const pct = maxXp > 0 && !rank.legend ? (rank.xpRequired / maxXp) * 100 : 0

                return (
                  <tr
                    key={rank.rank}
                    className={`border-b border-surface-border transition-colors ${
                      rank.legend ? 'bg-purple-900/20' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <span className={`font-bold text-lg ${rank.legend ? 'text-purple-400' : 'text-accent'}`}>
                        {rank.rank}
                      </span>
                      {rank.legend && (
                        <span className="ml-2 text-xs text-purple-400 font-semibold">★ LEGEND</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-foreground">
                      {rank.legend ? '—' : rank.xpRequired.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-foreground-secondary">
                      {cumulative[rank.rank]?.toLocaleString() || '—'}
                    </td>
                    <td className="px-4 py-3 w-40">
                      {rank.legend ? (
                        <span className="text-xs text-purple-400">🏆 Max Rank</span>
                      ) : (
                        <div className="h-2 bg-surface-hover rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-accent"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-foreground-muted">
                      {rank.rank === 1 && 'Starting rank'}
                      {rank.legend && 'Legend skills unlock'}
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
