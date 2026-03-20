'use client'

import { useState, useMemo } from 'react'

interface Skill {
  gameId: string
  name: string
  description: string
  costPoints: number
  costGold: string
  effect: string
  uiCategory: number
  dependsTo: string
  requiredAchievements: string
  requiredShips: string
  requiredRank: string
  icon: string
}

const CATEGORIES: Record<number, { name: string; icon: string; color: string; desc: string }> = {
  0: { name: 'Craft', icon: '🔨', color: 'text-amber-400', desc: 'Crafting, trading, and workshop skills' },
  1: { name: 'Exploration', icon: '🧭', color: 'text-blue-400', desc: 'Navigation, logistics, and travel skills' },
  2: { name: 'Battle', icon: '⚔️', color: 'text-red-400', desc: 'Combat, gunnery, and defensive skills' },
  3: { name: 'Legend', icon: '👑', color: 'text-purple-400', desc: 'Unlocks at Rank 30 — prestige abilities' },
}

function parseGoldCost(costGold: string): number | null {
  if (!costGold) return null
  const match = costGold.match(/(\d+)/)
  return match ? parseInt(match[1]) : null
}

function formatEffect(effect: string): string {
  if (!effect) return ''
  return effect
    .replace(/^[BP]/, '')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^\s+/, '')
    .replace(/\+/g, ' +')
    .trim()
}

type CategoryFilter = 'all' | 0 | 1 | 2 | 3

export default function SkillsContent({ skills }: { skills: Skill[] }) {
  const [category, setCategory] = useState<CategoryFilter>('all')

  const activeSkills = useMemo(() => skills.filter(s => s.name !== 'removed'), [skills])

  const filtered = useMemo(() => {
    if (category === 'all') return activeSkills
    return activeSkills.filter(s => s.uiCategory === category)
  }, [activeSkills, category])

  const grouped = useMemo(() => {
    const groups: Record<number, Skill[]> = { 0: [], 1: [], 2: [], 3: [] }
    for (const s of filtered) {
      if (groups[s.uiCategory]) groups[s.uiCategory].push(s)
    }
    return groups
  }, [filtered])

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
          📋 All ({activeSkills.length})
        </button>
        {Object.entries(CATEGORIES).map(([key, cat]) => {
          const catNum = parseInt(key) as 0 | 1 | 2 | 3
          const count = activeSkills.filter(s => s.uiCategory === catNum).length
          return (
            <button
              key={key}
              onClick={() => setCategory(catNum)}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                category === catNum
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground-secondary hover:text-foreground hover:bg-surface-hover'
              }`}
            >
              {cat.icon} {cat.name} ({count})
            </button>
          )
        })}
      </div>

      {/* Skill groups */}
      {Object.entries(grouped).map(([catKey, catSkills]) => {
        if (catSkills.length === 0) return null
        const cat = CATEGORIES[parseInt(catKey)]
        return (
          <section key={catKey}>
            <div className="mb-3">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <span className={cat.color}>{cat.icon}</span> {cat.name}
                <span className="text-foreground-muted text-sm font-normal">({catSkills.length})</span>
              </h2>
              <p className="text-foreground-secondary text-sm">{cat.desc}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {catSkills.map(skill => {
                const gold = parseGoldCost(skill.costGold)
                return (
                  <div key={skill.gameId} className="bg-surface border border-surface-border rounded-xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-foreground font-semibold">{skill.name}</h3>
                      <div className="flex gap-2 text-xs shrink-0">
                        {skill.costPoints > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-900/30 text-blue-400 border border-blue-800">
                            {skill.costPoints} SP
                          </span>
                        )}
                        {gold && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-900/30 text-amber-400 border border-amber-800">
                            {gold.toLocaleString()} gold
                          </span>
                        )}
                      </div>
                    </div>

                    {skill.description && (
                      <p className="text-foreground-secondary text-sm mb-2">{skill.description}</p>
                    )}

                    {skill.effect && (
                      <div className="text-xs text-cyan-400 mb-2">
                        <span className="text-foreground-muted">Effect: </span>
                        {formatEffect(skill.effect)}
                      </div>
                    )}

                    {/* Requirements */}
                    <div className="flex flex-wrap gap-2 text-xs">
                      {skill.requiredRank && (
                        <span className="text-foreground-muted">
                          Requires Rank <span className="text-accent">{skill.requiredRank}</span>
                        </span>
                      )}
                      {skill.dependsTo && (
                        <span className="text-foreground-muted">
                          Requires: <span className="text-foreground-secondary">{skill.dependsTo.replace(/skill_\d+/g, (m) => {
                            const dep = skills.find(s => s.gameId === m)
                            return dep ? dep.name : m
                          })}</span>
                        </span>
                      )}
                      {skill.requiredAchievements && (
                        <span className="text-foreground-muted">
                          Achievement: <span className="text-foreground-secondary">{skill.requiredAchievements}</span>
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
