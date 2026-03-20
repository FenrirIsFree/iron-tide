'use client'

import { useState, useMemo } from 'react'

interface Consumable {
  name: string
  category: string
  description: string
  cooldown: string
  activeTime: string
  restriction: string | null
  effects: Record<string, unknown>
  craft?: Record<string, number>
}

const CATEGORY_STYLES: Record<string, { label: string; icon: string; color: string; desc: string }> = {
  mending: { label: 'Repair', icon: '🔧', color: 'text-green-400', desc: 'Repair hull, sails, and weapons during combat' },
  boost:   { label: 'Boost', icon: '⚡', color: 'text-cyan-400', desc: 'Speed, reload, damage, and defensive buffs' },
  group:   { label: 'Squadron', icon: '🏴', color: 'text-purple-400', desc: 'Buffs that affect your entire squadron' },
}

function formatEffectKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, s => s.toUpperCase())
    .trim()
}

function formatEffectValue(value: unknown): string {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (typeof value === 'number') {
    if (value >= 1 && Number.isInteger(value)) return `+${value}`
    if (value < 1 && value > 0) return `${(value * 100).toFixed(0)}%`
    return `+${value}`
  }
  return String(value)
}

type CategoryFilter = 'all' | string

export default function ConsumablesContent({ consumables }: { consumables: Consumable[] }) {
  const [category, setCategory] = useState<CategoryFilter>('all')

  const filtered = useMemo(() => {
    if (category === 'all') return consumables
    return consumables.filter(c => c.category === category)
  }, [consumables, category])

  const grouped = useMemo(() => {
    const groups: Record<string, Consumable[]> = {}
    for (const c of filtered) {
      if (!groups[c.category]) groups[c.category] = []
      groups[c.category].push(c)
    }
    return groups
  }, [filtered])

  const categoryOrder = ['mending', 'boost', 'group']

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
          📋 All ({consumables.length})
        </button>
        {categoryOrder.map(cat => {
          const style = CATEGORY_STYLES[cat] || { label: cat, icon: '📄', color: 'text-foreground-secondary' }
          const count = consumables.filter(c => c.category === cat).length
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
              {style.icon} {style.label} ({count})
            </button>
          )
        })}
      </div>

      {/* Grouped cards */}
      {categoryOrder.map(cat => {
        const items = grouped[cat]
        if (!items || items.length === 0) return null
        const style = CATEGORY_STYLES[cat] || { label: cat, icon: '📄', color: 'text-foreground-secondary', desc: '' }

        return (
          <section key={cat}>
            <div className="mb-3">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <span className={style.color}>{style.icon}</span> {style.label}
                <span className="text-foreground-muted text-sm font-normal">({items.length})</span>
              </h2>
              <p className="text-foreground-secondary text-sm">{style.desc}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {items.map(c => (
                <div key={c.name} className="bg-surface border border-surface-border rounded-xl p-4">
                  <h3 className="text-foreground font-semibold mb-1">{c.name}</h3>
                  <p className="text-foreground-secondary text-sm mb-3">{c.description}</p>

                  {/* Effects */}
                  {Object.keys(c.effects).length > 0 && (
                    <div className="space-y-1 mb-3">
                      {Object.entries(c.effects).map(([key, val]) => (
                        <div key={key} className="flex justify-between text-xs">
                          <span className="text-foreground-secondary">{formatEffectKey(key)}</span>
                          <span className="text-cyan-400 font-mono">{formatEffectValue(val)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Timing */}
                  <div className="flex gap-4 text-xs text-foreground-muted">
                    {c.cooldown && <span>⏱️ {c.cooldown}</span>}
                    {c.activeTime && <span>⏳ {c.activeTime}</span>}
                  </div>

                  {/* Restriction */}
                  {c.restriction && (
                    <div className="mt-2 text-xs text-amber-400">
                      ⚠️ {c.restriction}
                    </div>
                  )}

                  {/* Crafting */}
                  {c.craft && Object.keys(c.craft).length > 0 && (
                    <div className="mt-2 pt-2 border-t border-surface-border">
                      <span className="text-foreground-muted text-xs">Craft: </span>
                      {Object.entries(c.craft).map(([res, qty], i) => (
                        <span key={res} className="text-xs text-foreground-secondary">
                          {i > 0 && ', '}
                          <span className="text-accent font-mono">{qty}</span> {res}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
