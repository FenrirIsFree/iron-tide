'use client'

import { useState } from 'react'

interface Enemy {
  type: string
  level: number
  count: number
}

interface Wave {
  enemies: Enemy[]
}

interface Mission {
  name: string
  description: string
  maxShipRank: string
  scrollsCost: number
  marksBonus: number
  skullsBonus: number
  mode: string
  players: number
  flags: string
  waves: Wave[]
}

const MODE_LABELS: Record<string, string> = {
  HasAllies: '🤝 Has Allies',
  Solo: '👤 Solo',
  Coop: '👥 Co-op',
}

export default function MissionsContent({ missions }: { missions: Mission[] }) {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      {missions.map((m, idx) => {
        const isOpen = expanded === m.name
        const totalEnemies = m.waves.reduce((sum, w) => sum + w.enemies.reduce((s, e) => s + e.count, 0), 0)

        return (
          <div
            key={idx}
            className={`bg-surface border rounded-xl overflow-hidden transition-colors cursor-pointer ${
              isOpen ? 'border-accent' : 'border-surface-border hover:border-surface-hover'
            }`}
            onClick={() => setExpanded(isOpen ? null : m.name)}
          >
            <div className="p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-foreground font-semibold text-lg">{m.name}</h3>
                  {m.description && (
                    <p className="text-foreground-secondary text-sm mt-1 max-w-xl">{m.description}</p>
                  )}
                </div>
                <div className="text-right shrink-0 ml-4">
                  <div className="text-accent font-mono text-sm">+{m.marksBonus} marks</div>
                  {m.skullsBonus > 0 && (
                    <div className="text-purple-400 font-mono text-xs">+{m.skullsBonus} skulls</div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 text-xs">
                <span className="px-2 py-0.5 rounded-full bg-blue-900/30 text-blue-400 border border-blue-800">
                  Ship Rate {m.maxShipRank}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-surface-hover text-foreground-secondary">
                  {m.waves.length} waves
                </span>
                <span className="px-2 py-0.5 rounded-full bg-surface-hover text-foreground-secondary">
                  {totalEnemies} enemies
                </span>
                <span className="px-2 py-0.5 rounded-full bg-surface-hover text-foreground-secondary">
                  📜 {m.scrollsCost} scrolls
                </span>
                <span className="px-2 py-0.5 rounded-full bg-surface-hover text-foreground-secondary">
                  {MODE_LABELS[m.mode] || m.mode}
                </span>
                {m.players > 1 && (
                  <span className="px-2 py-0.5 rounded-full bg-green-900/30 text-green-400 border border-green-800">
                    {m.players} players
                  </span>
                )}
              </div>
            </div>

            {/* Expanded wave breakdown */}
            {isOpen && (
              <div className="border-t border-surface-border px-5 py-4 bg-surface-hover/30">
                <h4 className="text-foreground text-sm font-semibold mb-3">Wave Breakdown</h4>
                <div className="space-y-2">
                  {m.waves.map((wave, wIdx) => (
                    <div key={wIdx} className="flex items-center gap-3">
                      <span className="text-accent font-mono text-xs w-16 shrink-0">Wave {wIdx + 1}</span>
                      <div className="flex flex-wrap gap-2">
                        {wave.enemies.map((e, eIdx) => (
                          <span key={eIdx} className="text-xs px-2 py-0.5 rounded bg-surface text-foreground-secondary border border-surface-border">
                            {e.count}× {e.type} (Lv.{e.level})
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
