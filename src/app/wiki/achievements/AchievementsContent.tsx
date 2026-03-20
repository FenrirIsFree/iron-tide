'use client'

import { useState, useMemo } from 'react'

interface Achievement {
  gameId: string
  triggerId: string
  name: string
  description: string
  ratingWeight: number
  isSingleGive: boolean
  category: string
}

const CATEGORY_STYLES: Record<string, { icon: string; color: string }> = {
  Battle: { icon: '⚔️', color: 'text-red-400' },
  Arena:  { icon: '🏟️', color: 'text-purple-400' },
  Top:    { icon: '👑', color: 'text-amber-400' },
  Other:  { icon: '📋', color: 'text-blue-400' },
}

export default function AchievementsContent({ achievements }: { achievements: Achievement[] }) {
  const [category, setCategory] = useState<string>('all')

  const categories = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const a of achievements) {
      counts[a.category] = (counts[a.category] || 0) + 1
    }
    return counts
  }, [achievements])

  const filtered = useMemo(() => {
    if (category === 'all') return achievements
    return achievements.filter(a => a.category === category)
  }, [achievements, category])

  const grouped = useMemo(() => {
    const groups: Record<string, Achievement[]> = {}
    for (const a of filtered) {
      if (!groups[a.category]) groups[a.category] = []
      groups[a.category].push(a)
    }
    return groups
  }, [filtered])

  const categoryOrder = ['Battle', 'Arena', 'Top', 'Other']

  return (
    <div className="space-y-6">
      {/* Category tabs */}
      <div className="flex flex-wrap gap-1 bg-surface border border-surface-border rounded-lg p-1">
        <button
          onClick={() => setCategory('all')}
          className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
            category === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'text-foreground-secondary hover:text-foreground hover:bg-surface-hover'
          }`}
        >
          🏆 All ({achievements.length})
        </button>
        {categoryOrder.map(cat => {
          const style = CATEGORY_STYLES[cat] || { icon: '📄', color: 'text-foreground-secondary' }
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                category === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground-secondary hover:text-foreground hover:bg-surface-hover'
              }`}
            >
              {style.icon} {cat} ({categories[cat] || 0})
            </button>
          )
        })}
      </div>

      {/* Achievement groups */}
      {categoryOrder.map(cat => {
        const items = grouped[cat]
        if (!items || items.length === 0) return null
        const style = CATEGORY_STYLES[cat] || { icon: '📄', color: 'text-foreground-secondary' }

        return (
          <section key={cat}>
            <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className={style.color}>{style.icon}</span> {cat}
              <span className="text-foreground-muted text-sm font-normal">({items.length})</span>
            </h2>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.sort((a, b) => b.ratingWeight - a.ratingWeight).map(a => (
                <div key={a.gameId} className="bg-surface border border-surface-border rounded-xl p-4">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-foreground font-semibold text-sm">{a.name}</h3>
                    <span className="text-accent font-mono text-xs shrink-0 ml-2">
                      +{a.ratingWeight}
                    </span>
                  </div>
                  <p className="text-foreground-secondary text-xs mb-2">{a.description}</p>
                  <div className="flex gap-2 text-xs">
                    {a.isSingleGive ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-900/30 text-amber-400 border border-amber-800">
                        One-time
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-green-900/30 text-green-400 border border-green-800">
                        Repeatable
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
