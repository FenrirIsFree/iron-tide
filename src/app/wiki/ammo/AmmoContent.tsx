'use client'

import { useState } from 'react'

interface Ammo {
  gameId: string
  name: string
  description: string
  speed: number
  penetration: number
  damageFactor: number
  damageToSails: number
  crewDamage: number
  effects: string
  distanceFactor: number
  reloadFactor: number
  massKg: number
  isRare: boolean
  cost: number
}

const EFFECT_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  CanMakeAnyBurnings: { label: 'Can start fires', icon: '🔥', color: 'text-orange-400' },
  FireArea: { label: 'Creates fire area', icon: '🔥', color: 'text-red-400' },
  ExtraMicroburning: { label: 'Extra burning', icon: '🔥', color: 'text-red-300' },
  AdditionalDispersion: { label: 'Extra scatter', icon: '💨', color: 'text-yellow-400' },
  CanMakeCannonsDamage: { label: 'Damages cannons', icon: '💥', color: 'text-amber-400' },
  Overpenetration: { label: 'Overpenetration', icon: '🎯', color: 'text-cyan-400' },
  IgnoreSailes: { label: 'Ignores sails', icon: '⛵', color: 'text-blue-400' },
}

function DamageBar({ value, max, color, label }: { value: number; max: number; color: string; label: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-foreground-secondary">{label}</span>
        <span className="text-foreground font-mono">{value}×</span>
      </div>
      <div className="h-2 bg-surface-hover rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default function AmmoContent({ ammo }: { ammo: Ammo[] }) {
  const [selected, setSelected] = useState<string | null>(null)

  // Sort: standard ammo first (no penetration), then special (has penetration)
  const standard = ammo.filter(a => a.penetration === 0)
  const special = ammo.filter(a => a.penetration > 0)

  const maxDamage = Math.max(...ammo.map(a => a.damageFactor))
  const maxSail = Math.max(...ammo.map(a => a.damageToSails))
  const maxCrew = Math.max(...ammo.map(a => a.crewDamage))

  function AmmoCard({ a }: { a: Ammo }) {
    const isOpen = selected === a.gameId
    const effects = a.effects.split(' ').filter(Boolean)

    return (
      <div
        className={`bg-surface border rounded-xl overflow-hidden transition-colors cursor-pointer ${
          isOpen ? 'border-accent' : 'border-surface-border hover:border-surface-hover'
        }`}
        onClick={() => setSelected(isOpen ? null : a.gameId)}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-foreground font-semibold">{a.name}</h3>
              {a.isRare && (
                <span className="text-xs text-amber-400 font-medium">★ Rare</span>
              )}
            </div>
            <div className="text-right">
              <span className="text-accent font-mono text-lg">{a.cost}</span>
              <span className="text-foreground-muted text-xs block">gold</span>
            </div>
          </div>

          {/* Stat bars */}
          <div className="space-y-2">
            <DamageBar value={a.damageFactor} max={maxDamage} color="bg-red-500" label="Hull Damage" />
            <DamageBar value={a.damageToSails} max={maxSail} color="bg-blue-500" label="Sail Damage" />
            <DamageBar value={a.crewDamage} max={maxCrew} color="bg-green-500" label="Crew Damage" />
          </div>

          {/* Effects */}
          {effects.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {effects.map(eff => {
                const info = EFFECT_LABELS[eff]
                return info ? (
                  <span key={eff} className={`text-xs px-2 py-0.5 rounded-full bg-surface-hover ${info.color}`}>
                    {info.icon} {info.label}
                  </span>
                ) : (
                  <span key={eff} className="text-xs px-2 py-0.5 rounded-full bg-surface-hover text-foreground-muted">
                    {eff}
                  </span>
                )
              })}
            </div>
          )}
        </div>

        {/* Expanded details */}
        {isOpen && (
          <div className="border-t border-surface-border px-4 py-3 bg-surface-hover/50 space-y-1 text-sm">
            {a.penetration > 0 && (
              <div className="flex justify-between">
                <span className="text-foreground-secondary">Penetration bonus</span>
                <span className="text-accent font-mono">+{a.penetration}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-foreground-secondary">Speed factor</span>
              <span className="text-foreground font-mono">{a.speed}×</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-secondary">Range factor</span>
              <span className="text-foreground font-mono">{a.distanceFactor}×</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-secondary">Reload factor</span>
              <span className="text-foreground font-mono">{a.reloadFactor}×</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-secondary">Mass</span>
              <span className="text-foreground font-mono">{a.massKg} kg</span>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Standard Ammo */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <span className="text-accent">⚔️</span> Cannon Ammunition
          <span className="text-foreground-muted text-sm font-normal">({standard.length})</span>
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {standard.map(a => <AmmoCard key={a.gameId} a={a} />)}
        </div>
      </section>

      {/* Special / Mortar Ammo */}
      {special.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="text-accent">🎯</span> Special & Mortar Ammunition
            <span className="text-foreground-muted text-sm font-normal">({special.length})</span>
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {special.map(a => <AmmoCard key={a.gameId} a={a} />)}
          </div>
        </section>
      )}

      {/* Legend */}
      <div className="bg-surface border border-surface-border rounded-xl p-4 text-xs text-foreground-muted">
        <p className="font-semibold text-foreground-secondary mb-1">How to read damage factors:</p>
        <p>Hull Damage 1.0× = normal damage. Higher = more hull damage. Sail Damage and Crew Damage work the same way — these are multipliers applied to your cannon&apos;s base stats.</p>
      </div>
    </div>
  )
}
