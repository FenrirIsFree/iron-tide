'use client'

import { useState, useMemo } from 'react'

// XP required to unlock each rate from the previous one
// These are the cumulative totals per ship page data
const RATE_XP: Record<number, number> = {
  7: 0,
  6: 800,
  5: 4500,
  4: 14000,
  3: 25000,
  2: 50000,
  1: 70000,
}

const RATE_LABELS: Record<number, string> = {
  7: 'Rate VII (Starter)',
  6: 'Rate VI',
  5: 'Rate V',
  4: 'Rate IV',
  3: 'Rate III',
  2: 'Rate II',
  1: 'Rate I (Top Tier)',
}

const SHIP_CLASSES = [
  { id: 'Battle', label: 'Battle', icon: '⚔️', gameType: 'Battleship', modifier: 1.0, note: 'Standard XP gain' },
  { id: 'Heavy', label: 'Heavy', icon: '🛡️', gameType: 'Hardship', modifier: 1.2, note: '+20% XP cost (more XP required)' },
  { id: 'Transport', label: 'Transport', icon: '📦', gameType: 'CargoShip', modifier: 1.0, note: 'Standard XP gain' },
  { id: 'Fast', label: 'Fast', icon: '💨', gameType: 'Destroyer', modifier: 0.8, note: '−20% XP cost (discount)' },
  { id: 'Siege', label: 'Siege', icon: '💣', gameType: 'Mortar', modifier: 1.0, note: 'Standard XP gain' },
]

export default function XpCalculatorClient() {
  const [classId, setClassId] = useState('Battle')
  const [fromRate, setFromRate] = useState(5)
  const [toRate, setToRate] = useState(1)
  const [upgradeBonus, setUpgradeBonus] = useState(false)

  const shipClass = useMemo(() => SHIP_CLASSES.find(c => c.id === classId)!, [classId])

  // Ensure fromRate > toRate (higher rate number = lower tier)
  const validFromRate = Math.max(toRate + 1, fromRate)

  const steps = useMemo(() => {
    const result: Array<{ from: number; to: number; baseXp: number; adjustedXp: number }> = []

    // Build steps from validFromRate down to toRate
    const rates = [7, 6, 5, 4, 3, 2, 1].filter(r => r <= validFromRate && r > toRate)

    for (let i = 0; i < rates.length; i++) {
      const fromR = rates[i]
      const toR = rates[i + 1] ?? toRate
      if (toR === undefined) continue

      const baseXp = RATE_XP[toR] - RATE_XP[fromR]
      const modifier = shipClass.modifier * (upgradeBonus ? 1 / 2 : 1) // all upgrades = 100% bonus = half XP needed? No: 100% bonus means earn double XP, so takes half as many battles
      // Actually "install all upgrades = 100% XP gain" means you earn XP twice as fast, so you need the same total XP but fewer battles
      // We'll show raw XP needed, and separately note that full upgrades = 50% fewer battles
      const adjustedXp = Math.round(baseXp * shipClass.modifier)

      result.push({ from: fromR, to: toR, baseXp, adjustedXp })
    }
    return result
  }, [validFromRate, toRate, shipClass, upgradeBonus])

  const totalBaseXp = useMemo(() => steps.reduce((sum, s) => sum + s.baseXp, 0), [steps])
  const totalAdjustedXp = useMemo(() => steps.reduce((sum, s) => sum + s.adjustedXp, 0), [steps])
  const effectiveBattlesNote = upgradeBonus
    ? `With all upgrades installed (+100% XP gain), you earn XP twice as fast — effectively ${Math.round(totalAdjustedXp / 2).toLocaleString()} XP worth of battles.`
    : 'Install all upgrades to earn XP at 100% bonus rate.'

  const rateOptions = [7, 6, 5, 4, 3, 2, 1]

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Class selector */}
        <div className="bg-surface border border-surface-border rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-foreground-secondary uppercase tracking-wider">Ship Class</h2>
          <div className="grid grid-cols-5 gap-2">
            {SHIP_CLASSES.map(cls => (
              <button
                key={cls.id}
                onClick={() => setClassId(cls.id)}
                className={`flex flex-col items-center gap-1 py-3 px-1 rounded-xl text-xs font-medium transition-colors ${
                  classId === cls.id
                    ? 'bg-accent/20 border border-accent text-accent'
                    : 'bg-surface-hover border border-transparent text-foreground-secondary hover:text-foreground'
                }`}
              >
                <span className="text-xl">{cls.icon}</span>
                <span>{cls.label}</span>
              </button>
            ))}
          </div>
          <div className="text-xs text-foreground-muted bg-background rounded-lg px-3 py-2">
            <span className="font-medium text-foreground-secondary">{shipClass.label}:</span>{' '}
            {shipClass.note}
            {shipClass.modifier !== 1.0 && (
              <span className={`ml-1 font-bold ${shipClass.modifier < 1 ? 'text-emerald-400' : 'text-amber-400'}`}>
                (×{shipClass.modifier})
              </span>
            )}
          </div>
        </div>

        {/* Rate range selector */}
        <div className="bg-surface border border-surface-border rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-foreground-secondary uppercase tracking-wider">Rate Range</h2>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-foreground-secondary mb-1">Current Rate (have)</label>
              <select
                value={fromRate}
                onChange={e => {
                  const v = Number(e.target.value)
                  setFromRate(v)
                  if (v <= toRate) setToRate(v - 1)
                }}
                className="w-full bg-background border border-surface-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
              >
                {rateOptions.filter(r => r > 1).map(r => (
                  <option key={r} value={r}>{RATE_LABELS[r]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground-secondary mb-1">Target Rate (want)</label>
              <select
                value={toRate}
                onChange={e => {
                  const v = Number(e.target.value)
                  setToRate(v)
                  if (fromRate <= v) setFromRate(v + 1)
                }}
                className="w-full bg-background border border-surface-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
              >
                {rateOptions.filter(r => r < fromRate).map(r => (
                  <option key={r} value={r}>{RATE_LABELS[r]}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setUpgradeBonus(v => !v)}
              className={`relative w-10 h-5 rounded-full transition-colors ${upgradeBonus ? 'bg-accent' : 'bg-surface-hover'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${upgradeBonus ? 'translate-x-5' : ''}`} />
            </button>
            <div>
              <div className="text-xs font-medium text-foreground">All Upgrades Installed</div>
              <div className="text-xs text-foreground-muted">+100% XP gain (earn XP twice as fast)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {steps.length > 0 ? (
        <div className="bg-surface border border-surface-border rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-surface-border bg-accent/5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <span className="text-sm text-foreground-secondary">
                  {shipClass.icon} {shipClass.label} — Rate {fromRate} → Rate {toRate}
                </span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-accent">{totalAdjustedXp.toLocaleString()} XP</div>
                {shipClass.modifier !== 1.0 && (
                  <div className="text-xs text-foreground-muted">
                    Base: {totalBaseXp.toLocaleString()} × {shipClass.modifier} modifier
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Step-by-step breakdown */}
          <div className="divide-y divide-surface-border">
            {steps.map(step => (
              <div key={`${step.from}-${step.to}`} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <span className="text-sm text-foreground font-medium">
                    Rate {step.from} → Rate {step.to}
                  </span>
                  <div className="text-xs text-foreground-muted mt-0.5">
                    {RATE_LABELS[step.to]}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-foreground font-mono">
                    {step.adjustedXp.toLocaleString()} XP
                  </div>
                  {shipClass.modifier !== 1.0 && (
                    <div className="text-xs text-foreground-muted">base: {step.baseXp.toLocaleString()}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-surface-border bg-background/50 space-y-2">
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-foreground-secondary">Total XP Required</span>
              <span className="text-accent font-bold text-lg">{totalAdjustedXp.toLocaleString()} XP</span>
            </div>
            <p className="text-xs text-foreground-muted">{effectiveBattlesNote}</p>
          </div>
        </div>
      ) : (
        <div className="bg-surface border border-surface-border rounded-xl p-8 text-center text-foreground-muted text-sm">
          Select a valid rate range (current rate must be higher than target rate).
        </div>
      )}

      {/* Class info table */}
      <div className="bg-surface border border-surface-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground-secondary uppercase tracking-wider mb-4">Class Modifiers</h3>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {SHIP_CLASSES.map(cls => (
            <div key={cls.id} className="bg-background rounded-lg p-3 text-center">
              <div className="text-xl mb-1">{cls.icon}</div>
              <div className="text-sm font-medium text-foreground">{cls.label}</div>
              <div className={`text-xs font-bold mt-1 ${
                cls.modifier < 1 ? 'text-emerald-400' :
                cls.modifier > 1 ? 'text-amber-400' : 'text-foreground-muted'
              }`}>
                {cls.modifier === 1 ? 'Standard' : cls.modifier < 1 ? `−${Math.round((1 - cls.modifier) * 100)}%` : `+${Math.round((cls.modifier - 1) * 100)}%`}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-foreground-muted mt-3">
          All modifiers apply to total XP cost. More branches researched in the same class tree grants a bonus XP multiplier to remaining branches.
        </p>
      </div>
    </div>
  )
}
