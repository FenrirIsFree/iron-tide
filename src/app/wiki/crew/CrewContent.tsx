'use client'

import { useState, useMemo } from 'react'

interface CrewMember {
  gameId: string
  name: string
  description: string
  type: string
  damage: number
  health: number
  capacity: number
  cost: number
  costMarks: number
  options: string
  effect: string
  effectPerSailor: string
  effectPerBoardingUnit: string
  icon: string
}

const FACTION_MAP: Record<string, { label: string; color: string }> = {
  Combats:     { label: 'Combat', color: 'text-red-400' },
  Sailors:     { label: 'Sailors', color: 'text-blue-400' },
  Pirates:     { label: 'Pirates', color: 'text-purple-400' },
  Adventurers: { label: 'Adventurers', color: 'text-green-400' },
  All:         { label: 'All Factions', color: 'text-foreground-secondary' },
}

const TYPE_INFO: Record<string, { label: string; icon: string; desc: string }> = {
  Sailor:   { label: 'Sailors', icon: '⛵', desc: 'Operate the ship. Insufficient sailors slow reloading and maneuvering.' },
  Boarding: { label: 'Boarding Units', icon: '⚔️', desc: 'Fight during boarding actions. Each type has different combat stats.' },
  Special:  { label: 'Special Crew', icon: '⭐', desc: 'Specialists that provide unique bonuses and abilities to your ship.' },
}

function formatEffect(effect: string): string {
  if (!effect) return '—'
  return effect
    .replace(/^B/, '')
    .replace(/^P/, '')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^\s+/, '')
    .replace(/\+/g, ' +')
    .trim()
}

type FilterTab = 'all' | 'Sailor' | 'Boarding' | 'Special'

export default function CrewContent({ crew }: { crew: CrewMember[] }) {
  const [tab, setTab] = useState<FilterTab>('all')
  const [factionFilter, setFactionFilter] = useState<string>('all')

  const factions = useMemo(() => {
    const set = new Set(crew.map(c => c.options))
    return ['all', ...Array.from(set).sort()]
  }, [crew])

  const filtered = useMemo(() => {
    let result = crew
    if (tab !== 'all') result = result.filter(c => c.type === tab)
    if (factionFilter !== 'all') result = result.filter(c => c.options === factionFilter)
    return result
  }, [crew, tab, factionFilter])

  const grouped = useMemo(() => {
    const groups: Record<string, CrewMember[]> = {}
    for (const c of filtered) {
      const key = c.type
      if (!groups[key]) groups[key] = []
      groups[key].push(c)
    }
    return groups
  }, [filtered])

  const tabs: { key: FilterTab; label: string; icon: string }[] = [
    { key: 'all', label: 'All', icon: '📋' },
    { key: 'Sailor', label: 'Sailors', icon: '⛵' },
    { key: 'Boarding', label: 'Boarding', icon: '⚔️' },
    { key: 'Special', label: 'Special', icon: '⭐' },
  ]

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex gap-1 bg-surface border border-surface-border rounded-lg p-1">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                tab === t.key
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground-secondary hover:text-foreground hover:bg-surface-hover'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {tab === 'Special' && (
          <select
            value={factionFilter}
            onChange={e => setFactionFilter(e.target.value)}
            className="bg-surface border border-surface-border rounded-lg px-3 py-1.5 text-sm text-foreground"
          >
            <option value="all">All Factions</option>
            {factions.filter(f => f !== 'all').map(f => (
              <option key={f} value={f}>{FACTION_MAP[f]?.label || f}</option>
            ))}
          </select>
        )}
      </div>

      {/* Crew Groups */}
      {Object.entries(grouped).map(([type, members]) => {
        const info = TYPE_INFO[type] || { label: type, icon: '👤', desc: '' }
        return (
          <section key={type}>
            <div className="mb-3">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <span className="text-accent">{info.icon}</span> {info.label}
                <span className="text-foreground-muted text-sm font-normal">({members.length})</span>
              </h2>
              {info.desc && <p className="text-foreground-secondary text-sm mt-1">{info.desc}</p>}
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {members.map(c => (
                <div key={c.gameId} className="bg-surface border border-surface-border rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-foreground font-semibold text-sm">{c.name}</h3>
                    <span className={`text-xs ${FACTION_MAP[c.options]?.color || 'text-foreground-muted'}`}>
                      {FACTION_MAP[c.options]?.label || c.options}
                    </span>
                  </div>

                  {/* Stats row */}
                  <div className="flex gap-4 text-xs mb-2">
                    <div>
                      <span className="text-foreground-muted">DMG </span>
                      <span className="text-red-400 font-mono">{c.damage}</span>
                    </div>
                    <div>
                      <span className="text-foreground-muted">HP </span>
                      <span className="text-green-400 font-mono">{c.health}</span>
                    </div>
                    <div>
                      <span className="text-foreground-muted">CAP </span>
                      <span className="text-blue-400 font-mono">{c.capacity}</span>
                    </div>
                  </div>

                  {/* Cost */}
                  <div className="flex gap-3 text-xs mb-2">
                    {c.cost > 0 && (
                      <span className="text-foreground-secondary">
                        <span className="text-accent">{c.cost}</span> gold
                      </span>
                    )}
                    {c.costMarks > 0 && (
                      <span className="text-foreground-secondary">
                        <span className="text-accent">{c.costMarks}</span> marks
                      </span>
                    )}
                  </div>

                  {/* Effect */}
                  {(c.effect || c.effectPerSailor || c.effectPerBoardingUnit) && (
                    <div className="text-xs space-y-0.5 mt-2 pt-2 border-t border-surface-border">
                      {c.effect && (
                        <div className="text-cyan-400">
                          <span className="text-foreground-muted">Effect: </span>
                          {formatEffect(c.effect)}
                        </div>
                      )}
                      {c.effectPerSailor && (
                        <div className="text-cyan-400">
                          <span className="text-foreground-muted">Per sailor: </span>
                          {formatEffect(c.effectPerSailor)}
                        </div>
                      )}
                      {c.effectPerBoardingUnit && (
                        <div className="text-cyan-400">
                          <span className="text-foreground-muted">Per unit: </span>
                          {formatEffect(c.effectPerBoardingUnit)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )
      })}

      {filtered.length === 0 && (
        <div className="text-center py-12 text-foreground-muted">
          No crew members match the current filters.
        </div>
      )}
    </div>
  )
}
