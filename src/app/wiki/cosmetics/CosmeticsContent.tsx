'use client'

import { useState, useMemo } from 'react'

interface Cosmetic {
  name: string
  nameLocalized: string
  category: string
  price: number
  priceReal: number
  requiredRank: string
  fraction: string
}

const CATEGORY_STYLES: Record<string, { icon: string; label: string; color: string }> = {
  Flag:           { icon: '🏴', label: 'Flags', color: 'text-red-400' },
  SailTexture:    { icon: '⛵', label: 'Sails', color: 'text-blue-400' },
  BowFigure:      { icon: '🗿', label: 'Figureheads', color: 'text-amber-400' },
  Decal1:         { icon: '🎨', label: 'Hull Decals', color: 'text-green-400' },
  Decal2:         { icon: '✨', label: 'Detail Decals', color: 'text-purple-400' },
  Satellite:      { icon: '🛸', label: 'Satellites', color: 'text-cyan-400' },
  ShipFullDesign: { icon: '🚢', label: 'Ship Designs', color: 'text-pink-400' },
}

const CATEGORY_ORDER = ['Flag', 'SailTexture', 'BowFigure', 'ShipFullDesign', 'Decal1', 'Decal2', 'Satellite']

export default function CosmeticsContent({ cosmetics }: { cosmetics: Cosmetic[] }) {
  const [category, setCategory] = useState<string>('all')
  const [search, setSearch] = useState('')

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const c of cosmetics) {
      counts[c.category] = (counts[c.category] || 0) + 1
    }
    return counts
  }, [cosmetics])

  const filtered = useMemo(() => {
    let result = cosmetics
    if (category !== 'all') result = result.filter(c => c.category === category)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(c =>
        c.nameLocalized.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
      )
    }
    return result
  }, [cosmetics, category, search])

  const grouped = useMemo(() => {
    const groups: Record<string, Cosmetic[]> = {}
    for (const c of filtered) {
      if (!groups[c.category]) groups[c.category] = []
      groups[c.category].push(c)
    }
    return groups
  }, [filtered])

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-wrap gap-1 bg-surface border border-surface-border rounded-lg p-1">
          <button
            onClick={() => setCategory('all')}
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
              category === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground-secondary hover:text-foreground hover:bg-surface-hover'
            }`}
          >
            All ({cosmetics.length})
          </button>
          {CATEGORY_ORDER.map(cat => {
            const style = CATEGORY_STYLES[cat] || { icon: '📄', label: cat, color: 'text-foreground-secondary' }
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
                {style.icon} {style.label} ({categoryCounts[cat] || 0})
              </button>
            )
          })}
        </div>

        <input
          type="text"
          placeholder="Search cosmetics..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-surface border border-surface-border rounded-lg px-3 py-1.5 text-sm text-foreground placeholder:text-foreground-muted w-48"
        />
      </div>

      {/* Results count */}
      <p className="text-foreground-muted text-sm">{filtered.length} items</p>

      {/* Grouped display */}
      {CATEGORY_ORDER.map(cat => {
        const items = grouped[cat]
        if (!items || items.length === 0) return null
        const style = CATEGORY_STYLES[cat] || { icon: '📄', label: cat, color: 'text-foreground-secondary' }

        return (
          <section key={cat}>
            <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className={style.color}>{style.icon}</span> {style.label}
              <span className="text-foreground-muted text-sm font-normal">({items.length})</span>
            </h2>
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {items.map((c, i) => (
                <div key={i} className="bg-surface border border-surface-border rounded-lg p-3 text-sm">
                  <div className="text-foreground font-medium text-xs truncate" title={c.nameLocalized}>
                    {c.nameLocalized || c.name}
                  </div>
                  <div className="flex gap-3 mt-1 text-xs text-foreground-muted">
                    {c.price > 0 && <span><span className="text-accent">{c.price.toLocaleString()}</span> gold</span>}
                    {c.priceReal > 0 && <span><span className="text-amber-400">{c.priceReal}</span> 💎</span>}
                    {c.price === 0 && c.priceReal === 0 && <span className="text-green-400">Free</span>}
                  </div>
                  {c.requiredRank && (
                    <div className="text-xs text-foreground-muted mt-0.5">Rank {c.requiredRank}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )
      })}

      {filtered.length === 0 && (
        <div className="text-center py-12 text-foreground-muted">No cosmetics match the current filters.</div>
      )}
    </div>
  )
}
