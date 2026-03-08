'use client'

import { useState } from 'react'

interface Ship {
  gameId: number
  name: string
}

interface LargeChestReward {
  index: number
  tier: number
  weight: number
  category: string
  reward: string
  shipId?: number
  flags?: Record<string, boolean>
}

interface ProbabilityGroup {
  groupWeight: number
  tier: number
  rewards: {
    reward: string
    rareDisplay?: boolean
    assurance?: { openCount: number; guaranteeAt: number }
    flags?: Record<string, boolean>
    [key: string]: unknown
  }[]
}

interface NewYearReward {
  probability: number
  rarity: number
  reward: string
  checkShipId?: number[]
  [key: string]: unknown
}

interface ChestData {
  ships: Ship[]
  large: { rewards: LargeChestReward[] }
  imperial: { probabilityGroups: ProbabilityGroup[] }
  inca: { probabilityGroups: ProbabilityGroup[] }
  newYear: { rewards: NewYearReward[] }
}

const TIER_LABELS: Record<number, string> = { 1: 'Common', 2: 'Rare', 3: 'Legendary' }
const TIER_COLORS: Record<number, string> = {
  1: 'text-foreground-secondary',
  2: 'text-blue-400',
  3: 'text-yellow-400',
}
const TIER_BG: Record<number, string> = {
  1: 'border-surface-border',
  2: 'border-blue-400/30',
  3: 'border-yellow-400/30',
}

type ChestTab = 'large' | 'imperial' | 'inca' | 'newyear'

export default function ChestsContent({ data }: { data: ChestData }) {
  const [activeChest, setActiveChest] = useState<ChestTab>('large')
  const shipMap: Record<number, string> = {}
  data.ships.forEach(s => { shipMap[s.gameId] = s.name })

  const chests: { id: ChestTab; label: string; icon: string }[] = [
    { id: 'large', label: 'Large Chest', icon: '📦' },
    { id: 'imperial', label: 'Imperial Chest', icon: '👑' },
    { id: 'inca', label: 'Inca Chest', icon: '🏛️' },
    { id: 'newyear', label: 'New Year Chest', icon: '🎆' },
  ]

  return (
    <div>
      {/* Chest tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {chests.map(c => (
          <button
            key={c.id}
            onClick={() => setActiveChest(c.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeChest === c.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-surface text-foreground-secondary hover:text-foreground'
            }`}
          >
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      {activeChest === 'large' && <LargeChest rewards={data.large.rewards} shipMap={shipMap} />}
      {activeChest === 'imperial' && <ProbabilityChest name="Imperial Chest" description="Available from the Empire shop. Contains exclusive early access ships, unique cosmetics, and valuable resources." groups={data.imperial.probabilityGroups} shipMap={shipMap} />}
      {activeChest === 'inca' && <ProbabilityChest name="Inca Chest" description="A rare chest with a chance at the Huracan — one of the most powerful ships in the game." groups={data.inca.probabilityGroups} shipMap={shipMap} />}
      {activeChest === 'newyear' && <NewYearChest rewards={data.newYear.rewards} shipMap={shipMap} />}
    </div>
  )
}

function LargeChest({ rewards, shipMap }: { rewards: LargeChestReward[]; shipMap: Record<number, string> }) {
  const totalWeight = rewards.reduce((sum, r) => sum + r.weight, 0)

  // Group by tier
  const tiers: Record<number, LargeChestReward[]> = {}
  rewards.forEach(r => {
    if (!tiers[r.tier]) tiers[r.tier] = []
    tiers[r.tier].push(r)
  })

  // Tier totals
  const tierTotals: Record<number, number> = {}
  Object.entries(tiers).forEach(([t, rs]) => {
    tierTotals[parseInt(t)] = rs.reduce((s, r) => s + r.weight, 0)
  })

  return (
    <div>
      <div className="bg-surface border border-surface-border rounded-xl p-4 mb-6">
        <h2 className="text-xl font-bold text-foreground mb-2">📦 Large Chest</h2>
        <p className="text-foreground-secondary text-sm mb-3">
          The standard premium chest. Contains resources, cosmetics, premium time, and ships.
        </p>
        <div className="flex flex-wrap gap-4 text-sm">
          {[3, 2, 1].map(tier => (
            <div key={tier} className="flex items-center gap-2">
              <span className={TIER_COLORS[tier]}>{TIER_LABELS[tier]}</span>
              <span className="text-foreground-muted">
                {(tierTotals[tier] / totalWeight * 100).toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {[3, 2, 1].map(tier => (
        <div key={tier} className="mb-6">
          <h3 className={`text-lg font-semibold mb-3 ${TIER_COLORS[tier]}`}>
            {tier === 3 ? '⭐' : tier === 2 ? '💎' : '📦'} {TIER_LABELS[tier]} Rewards — {(tierTotals[tier] / totalWeight * 100).toFixed(2)}% total
          </h3>
          <div className="space-y-2">
            {tiers[tier]?.sort((a, b) => b.weight - a.weight).map(r => {
              const pct = (r.weight / totalWeight * 100)
              const displayReward = r.shipId ? `🚢 ${shipMap[r.shipId] || r.reward}` : r.reward
              return (
                <div key={r.index} className={`bg-surface border ${TIER_BG[tier]} rounded-lg px-4 py-3 flex items-center justify-between`}>
                  <div className="flex-1">
                    <span className={`text-sm font-medium ${r.shipId ? 'text-accent' : 'text-foreground'}`}>
                      {displayReward}
                    </span>
                    {r.category && (
                      <span className="text-foreground-muted text-xs ml-2">({formatCategory(r.category)})</span>
                    )}
                  </div>
                  <div className="text-right ml-4 shrink-0">
                    <span className={`text-sm font-medium ${TIER_COLORS[tier]}`}>
                      {pct >= 0.01 ? `${pct.toFixed(2)}%` : `${(pct * 100).toFixed(1)}‱`}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

function ProbabilityChest({ name, description, groups, shipMap }: {
  name: string
  description: string
  groups: ProbabilityGroup[]
  shipMap: Record<number, string>
}) {
  const totalWeight = groups.reduce((sum, g) => sum + g.groupWeight, 0)

  // Group by tier
  const tiers: Record<number, ProbabilityGroup[]> = {}
  groups.forEach(g => {
    if (!tiers[g.tier]) tiers[g.tier] = []
    tiers[g.tier].push(g)
  })

  const tierTotals: Record<number, number> = {}
  Object.entries(tiers).forEach(([t, gs]) => {
    tierTotals[parseInt(t)] = gs.reduce((s, g) => s + g.groupWeight, 0)
  })

  return (
    <div>
      <div className="bg-surface border border-surface-border rounded-xl p-4 mb-6">
        <h2 className="text-xl font-bold text-foreground mb-2">{name}</h2>
        <p className="text-foreground-secondary text-sm mb-3">{description}</p>
        <div className="flex flex-wrap gap-4 text-sm">
          {[3, 2, 1].filter(t => tierTotals[t]).map(tier => (
            <div key={tier} className="flex items-center gap-2">
              <span className={TIER_COLORS[tier]}>{TIER_LABELS[tier]}</span>
              <span className="text-foreground-muted">
                {(tierTotals[tier] / totalWeight * 100).toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {[3, 2, 1].filter(t => tiers[t]).map(tier => (
        <div key={tier} className="mb-6">
          <h3 className={`text-lg font-semibold mb-3 ${TIER_COLORS[tier]}`}>
            {tier === 3 ? '⭐' : tier === 2 ? '💎' : '📦'} {TIER_LABELS[tier]} Rewards — {(tierTotals[tier] / totalWeight * 100).toFixed(2)}% total
          </h3>
          <div className="space-y-2">
            {tiers[tier]?.sort((a, b) => b.groupWeight - a.groupWeight).map((g, gi) => {
              const pct = (g.groupWeight / totalWeight * 100)
              return (
                <div key={gi} className={`bg-surface border ${TIER_BG[tier]} rounded-lg px-4 py-3`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium ${TIER_COLORS[tier]}`}>
                      {pct.toFixed(2)}%
                    </span>
                    {g.rewards[0]?.assurance && (
                      <span className="text-foreground-muted text-xs">
                        Guaranteed after {g.rewards[0].assurance.guaranteeAt} opens
                      </span>
                    )}
                  </div>
                  {g.rewards.map((r, ri) => (
                    <div key={ri} className="text-sm text-foreground-secondary py-0.5">
                      {r.rareDisplay && '🌟 '}{r.reward}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

function NewYearChest({ rewards, shipMap }: { rewards: NewYearReward[]; shipMap: Record<number, string> }) {
  const totalProb = rewards.reduce((sum, r) => sum + r.probability, 0)

  // Sort by rarity desc, then probability desc
  const sorted = [...rewards].sort((a, b) => b.rarity - a.rarity || b.probability - a.probability)

  // Group by rarity
  const tiers: Record<number, NewYearReward[]> = {}
  sorted.forEach(r => {
    if (!tiers[r.rarity]) tiers[r.rarity] = []
    tiers[r.rarity].push(r)
  })

  const tierTotals: Record<number, number> = {}
  Object.entries(tiers).forEach(([t, rs]) => {
    tierTotals[parseInt(t)] = rs.reduce((s, r) => s + r.probability, 0)
  })

  return (
    <div>
      <div className="bg-surface border border-surface-border rounded-xl p-4 mb-6">
        <h2 className="text-xl font-bold text-foreground mb-2">🎆 New Year Chest</h2>
        <p className="text-foreground-secondary text-sm mb-3">
          Seasonal chest available during New Year events. Contains exclusive ships, rare cosmetics, and premium items.
        </p>
        <div className="flex flex-wrap gap-4 text-sm">
          {[3, 2, 1].filter(t => tierTotals[t]).map(tier => (
            <div key={tier} className="flex items-center gap-2">
              <span className={TIER_COLORS[tier]}>{TIER_LABELS[tier]}</span>
              <span className="text-foreground-muted">
                {(tierTotals[tier] / totalProb * 100).toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {[3, 2, 1].filter(t => tiers[t]).map(tier => (
        <div key={tier} className="mb-6">
          <h3 className={`text-lg font-semibold mb-3 ${TIER_COLORS[tier]}`}>
            {tier === 3 ? '⭐' : tier === 2 ? '💎' : '📦'} {TIER_LABELS[tier]} Rewards — {(tierTotals[tier] / totalProb * 100).toFixed(2)}% total
          </h3>
          <div className="space-y-2">
            {tiers[tier]?.map((r, i) => {
              const pct = (r.probability / totalProb * 100)
              const isShip = r.checkShipId && r.checkShipId.length > 0
              const displayReward = isShip
                ? `🚢 ${r.checkShipId!.map(id => shipMap[id] || `Ship #${id}`).join(', ')}`
                : r.reward
              return (
                <div key={i} className={`bg-surface border ${TIER_BG[tier]} rounded-lg px-4 py-3 flex items-center justify-between`}>
                  <span className={`text-sm font-medium ${isShip ? 'text-accent' : 'text-foreground'}`}>
                    {displayReward}
                  </span>
                  <span className={`text-sm font-medium ${TIER_COLORS[tier]} ml-4 shrink-0`}>
                    {pct.toFixed(2)}%
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

function formatCategory(cat: string): string {
  return cat
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, s => s.toUpperCase())
    .replace('Or', '/')
    .trim()
}
