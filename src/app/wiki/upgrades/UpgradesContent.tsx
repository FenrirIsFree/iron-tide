'use client'

import { useState, useMemo } from 'react'

interface UpgradeEffect {
  stat: string
  gameKey: string
  rankedValues?: string[]
  value: string
}

interface Upgrade {
  name: string
  slotType: string
  category: string
  description: string
  effects: UpgradeEffect[]
  effectsRaw: string
  wearType: string
  cost: {
    gold: number
    materials: { item: string; quantity: number }[]
  }
  wear: string
}

const CATEGORY_STYLES: Record<string, { icon: string; color: string }> = {
  Combat:       { icon: '⚔️', color: 'text-red-400' },
  Protection:   { icon: '🛡️', color: 'text-blue-400' },
  Speed:        { icon: '⛵', color: 'text-cyan-400' },
  Sailes:       { icon: '🏴', color: 'text-teal-400' },
  Support:      { icon: '📦', color: 'text-green-400' },
  Mortars:      { icon: '💥', color: 'text-orange-400' },
  Modification: { icon: '🔧', color: 'text-purple-400' },
  Unique:       { icon: '⭐', color: 'text-amber-400' },
}

const SLOT_LABELS: Record<string, string> = {
  normal: 'Standard Slot',
  modification: 'Modification Slot',
  sail: 'Sail Slot',
}

export default function UpgradesContent({ upgrades }: { upgrades: Upgrade[] }) {
  const [category, setCategory] = useState<string>('all')
  const [expanded, setExpanded] = useState<string | null>(null)

  const categories = useMemo(() => {
    const set = new Set(upgrades.map(u => u.category))
    return Array.from(set).sort()
  }, [upgrades])

  const filtered = useMemo(() => {
    if (category === 'all') return upgrades
    return upgrades.filter(u => u.category === category)
  }, [upgrades, category])

  return (
    <div className="space-y-6">
      {/* Category filter */}
      <div className="flex flex-wrap gap-1 bg-surface border border-surface-border rounded-lg p-1">
        <button
          onClick={() => setCategory('all')}
          className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
            category === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'text-foreground-secondary hover:text-foreground hover:bg-surface-hover'
          }`}
        >
          📋 All ({upgrades.length})
        </button>
        {categories.map(cat => {
          const style = CATEGORY_STYLES[cat] || { icon: '📄', color: 'text-foreground-secondary' }
          const count = upgrades.filter(u => u.category === cat).length
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
              {style.icon} {cat} ({count})
            </button>
          )
        })}
      </div>

      {/* Upgrade cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map(u => {
          const isOpen = expanded === u.name
          const style = CATEGORY_STYLES[u.category] || { icon: '📄', color: 'text-foreground-secondary' }

          return (
            <div
              key={u.name}
              className={`bg-surface border rounded-xl overflow-hidden transition-colors cursor-pointer ${
                isOpen ? 'border-accent' : 'border-surface-border hover:border-surface-hover'
              }`}
              onClick={() => setExpanded(isOpen ? null : u.name)}
            >
              <div className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-foreground font-semibold">{u.name}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className={`text-xs ${style.color}`}>{style.icon} {u.category}</span>
                      <span className="text-xs text-foreground-muted">• {SLOT_LABELS[u.slotType] || u.slotType}</span>
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <span className="text-accent font-mono">{u.cost.gold.toLocaleString()}</span>
                    <span className="text-foreground-muted"> gold</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-foreground-secondary text-sm mb-3">{u.description}</p>

                {/* Effects */}
                <div className="space-y-1">
                  {u.effects.map((eff, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span className="text-foreground-secondary">{eff.stat}</span>
                      <span className="text-cyan-400 font-mono">{eff.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expanded details */}
              {isOpen && (
                <div className="border-t border-surface-border px-4 py-3 bg-surface-hover/50 space-y-3 text-sm">
                  {/* Ranked values */}
                  {u.effects.some(e => e.rankedValues && e.rankedValues.length > 0) && (
                    <div>
                      <h4 className="text-foreground-secondary text-xs font-semibold mb-1">Values by Ship Rate</h4>
                      {u.effects.filter(e => e.rankedValues && e.rankedValues.length > 0).map((eff, i) => (
                        <div key={i} className="mb-1">
                          <span className="text-foreground-muted text-xs">{eff.stat}: </span>
                          <span className="text-cyan-400 text-xs font-mono">
                            {eff.rankedValues?.map((v, idx) => (
                              <span key={idx}>
                                {idx > 0 && <span className="text-foreground-muted"> → </span>}
                                {v}
                              </span>
                            ))}
                          </span>
                        </div>
                      ))}
                      <p className="text-foreground-muted text-xs mt-1">Rate VII → Rate I (left to right)</p>
                    </div>
                  )}

                  {/* Materials */}
                  {u.cost.materials.length > 0 && (
                    <div>
                      <h4 className="text-foreground-secondary text-xs font-semibold mb-1">Materials</h4>
                      <div className="flex flex-wrap gap-2">
                        {u.cost.materials.map((m, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 rounded bg-surface text-foreground-secondary border border-surface-border">
                            {m.item}: <span className="text-accent font-mono">{m.quantity}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Wear */}
                  {u.wear && (
                    <div className="flex justify-between text-xs">
                      <span className="text-foreground-secondary">Durability</span>
                      <span className="text-foreground-muted">{u.wear}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
