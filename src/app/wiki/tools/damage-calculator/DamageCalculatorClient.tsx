'use client'

import { useState, useMemo } from 'react'
import type { Weapon, Ammo, Ship } from '@/lib/gameData'

interface Props {
  weapons: Weapon[]
  ammoList: Ammo[]
  ships: Ship[]
}

// Angle multiplier: 0° (broadside) = 1.0x, 90° (bow) = 0.3x
// Linear interpolation based on PVP analysis
function getAngleMultiplier(angle: number): number {
  // 0 = broadside (full damage), 90 = bow (30% damage)
  return 1.0 - (angle / 90) * 0.7
}

function formatNum(n: number, decimals = 1): string {
  return n.toFixed(decimals)
}

export default function DamageCalculatorClient({ weapons, ammoList, ships }: Props) {
  const [weaponId, setWeaponId] = useState(weapons[0]?.gameId ?? '')
  const [ammoId, setAmmoId] = useState(ammoList[0]?.gameId ?? '')
  const [targetMode, setTargetMode] = useState<'ship' | 'manual'>('ship')
  const [targetShipId, setTargetShipId] = useState(String(ships[0]?.gameId ?? ''))
  const [manualArmor, setManualArmor] = useState(5)
  const [manualHp, setManualHp] = useState(1000)
  const [angle, setAngle] = useState(0)

  const weapon = useMemo(() => weapons.find(w => w.gameId === weaponId), [weapons, weaponId])
  const ammo = useMemo(() => ammoList.find(a => a.gameId === ammoId), [ammoList, ammoId])

  const targetShip = useMemo(() => {
    if (targetMode !== 'ship') return null
    return ships.find(s => String(s.gameId) === targetShipId) ?? null
  }, [ships, targetShipId, targetMode])

  const targetArmor = targetMode === 'ship' ? (targetShip?.armor ?? 0) : manualArmor
  const targetHp = targetMode === 'ship' ? (targetShip?.health ?? 0) : manualHp

  const isMortar = weapon?.type === 'Mortar'

  const results = useMemo(() => {
    if (!weapon || !ammo) return null

    const penetration = weapon.damage
    const ammoFactor = ammo.damageFactor

    // Mortar ignores angle
    const effectiveAngle = isMortar ? 0 : angle
    const angleMult = getAngleMultiplier(effectiveAngle)
    const effectiveArmor = targetArmor * (1 + (effectiveAngle / 90) * 1.5)

    const rawDamage = Math.max(0, penetration - targetArmor) * ammoFactor
    const effectiveDamage = Math.max(0, penetration - effectiveArmor) * ammoFactor * angleMult

    const shotsToKill = effectiveDamage > 0 ? Math.ceil(targetHp / effectiveDamage) : Infinity
    const dps = weapon.reload > 0 ? effectiveDamage / weapon.reload : 0

    return { rawDamage, effectiveDamage, dps, shotsToKill, angleMult, effectiveArmor }
  }, [weapon, ammo, targetArmor, targetHp, angle, isMortar])

  // Group weapons by type
  const weaponGroups = useMemo(() => {
    const groups: Record<string, Weapon[]> = {}
    for (const w of weapons) {
      const g = w.type || 'Other'
      if (!groups[g]) groups[g] = []
      groups[g].push(w)
    }
    return groups
  }, [weapons])

  const angleLabel = angle === 0 ? 'Broadside (full damage)' : angle === 90 ? 'Bow (minimum damage)' : `${angle}° angle`

  return (
    <div className="space-y-6">
      {/* Inputs grid */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Weapon selection */}
        <div className="bg-surface border border-surface-border rounded-xl p-5 space-y-4">
          <h2 className="text-base font-semibold text-foreground">⚔️ Attacker</h2>

          <div>
            <label className="block text-xs font-medium text-foreground-secondary mb-1">Weapon</label>
            <select
              value={weaponId}
              onChange={e => setWeaponId(e.target.value)}
              className="w-full bg-background border border-surface-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
            >
              {Object.entries(weaponGroups).map(([group, ws]) => (
                <optgroup key={group} label={group}>
                  {ws.map(w => (
                    <option key={w.gameId} value={w.gameId}>
                      {w.name} (pen {w.damage}, {w.reload}s reload)
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground-secondary mb-1">Ammo Type</label>
            <select
              value={ammoId}
              onChange={e => setAmmoId(e.target.value)}
              className="w-full bg-background border border-surface-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
            >
              {ammoList.map(a => (
                <option key={a.gameId} value={a.gameId}>
                  {a.name} (×{a.damageFactor} dmg{a.damageFactor !== 1 ? ', ' + (a.damageFactor < 1 ? 'reduced' : 'increased') + ' damage' : ''})
                </option>
              ))}
            </select>
          </div>

          {/* Weapon stat summary */}
          {weapon && (
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              {[
                { label: 'Penetration', value: weapon.damage },
                { label: 'Reload', value: `${weapon.reload}s` },
                { label: 'Range', value: `${weapon.range}m` },
              ].map(s => (
                <div key={s.label} className="bg-background rounded-lg p-2">
                  <div className="text-accent font-bold text-sm">{s.value}</div>
                  <div className="text-foreground-muted">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Impact angle */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-foreground-secondary">Impact Angle</label>
              <span className="text-xs text-accent font-medium">{angleLabel}</span>
            </div>
            {isMortar ? (
              <div className="text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-lg px-3 py-2">
                ⚠️ Mortars fire from above — impact angle is ignored. Full penetration regardless of target orientation.
              </div>
            ) : (
              <>
                <input
                  type="range"
                  min={0}
                  max={90}
                  step={5}
                  value={angle}
                  onChange={e => setAngle(Number(e.target.value))}
                  className="w-full accent-[var(--color-accent)]"
                />
                <div className="flex justify-between text-xs text-foreground-muted mt-1">
                  <span>0° Broadside</span>
                  <span>90° Bow/Stern</span>
                </div>
                {/* Visual angle indicator */}
                <div className="mt-3 flex items-center gap-3">
                  <div className="relative flex-shrink-0 w-16 h-16">
                    {/* Ship silhouette */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-4 h-10 bg-surface-hover border border-surface-border rounded-sm" />
                    </div>
                    {/* Angle arrow */}
                    <svg
                      viewBox="0 0 64 64"
                      className="absolute inset-0 w-full h-full"
                      style={{ transform: `rotate(${angle}deg)`, transformOrigin: '50% 50%' }}
                    >
                      <line x1="8" y1="32" x2="56" y2="32" stroke="var(--color-accent)" strokeWidth="2" markerEnd="url(#arrow)" />
                      <defs>
                        <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                          <path d="M0,0 L0,6 L6,3 z" fill="var(--color-accent)" />
                        </marker>
                      </defs>
                    </svg>
                  </div>
                  <div className="text-xs text-foreground-muted">
                    Angle multiplier: <span className="text-accent font-bold">×{formatNum(getAngleMultiplier(angle), 2)}</span>
                    <br />
                    Effective armor: <span className="text-foreground font-medium">{formatNum(targetArmor * (1 + (angle / 90) * 1.5), 1)}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Target selection */}
        <div className="bg-surface border border-surface-border rounded-xl p-5 space-y-4">
          <h2 className="text-base font-semibold text-foreground">🎯 Target</h2>

          <div className="flex gap-2">
            <button
              onClick={() => setTargetMode('ship')}
              className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                targetMode === 'ship'
                  ? 'bg-accent text-background'
                  : 'bg-surface-hover text-foreground-secondary hover:text-foreground'
              }`}
            >
              Select Ship
            </button>
            <button
              onClick={() => setTargetMode('manual')}
              className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                targetMode === 'manual'
                  ? 'bg-accent text-background'
                  : 'bg-surface-hover text-foreground-secondary hover:text-foreground'
              }`}
            >
              Manual Entry
            </button>
          </div>

          {targetMode === 'ship' ? (
            <>
              <div>
                <label className="block text-xs font-medium text-foreground-secondary mb-1">Target Ship</label>
                <select
                  value={targetShipId}
                  onChange={e => setTargetShipId(e.target.value)}
                  className="w-full bg-background border border-surface-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
                >
                  {ships.map(s => (
                    <option key={s.gameId} value={String(s.gameId)}>
                      {s.name} ({s.inGameClass}, Rate {s.inGameRate})
                    </option>
                  ))}
                </select>
              </div>
              {targetShip && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { label: 'HP', value: targetShip.health.toLocaleString() },
                    { label: 'Armor', value: targetShip.armor },
                    { label: 'Class', value: targetShip.displayClass },
                    { label: 'Rate', value: `Rate ${targetShip.inGameRate}` },
                  ].map(s => (
                    <div key={s.label} className="flex justify-between bg-background rounded px-2 py-1.5">
                      <span className="text-foreground-muted">{s.label}</span>
                      <span className="text-foreground font-medium">{s.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-foreground-secondary mb-1">
                  Target Armor: <span className="text-accent">{manualArmor}</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={15}
                  step={0.5}
                  value={manualArmor}
                  onChange={e => setManualArmor(Number(e.target.value))}
                  className="w-full accent-[var(--color-accent)]"
                />
                <div className="flex justify-between text-xs text-foreground-muted mt-0.5">
                  <span>0 (no armor)</span>
                  <span>15 (max)</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground-secondary mb-1">
                  Target HP: <span className="text-accent">{manualHp.toLocaleString()}</span>
                </label>
                <input
                  type="range"
                  min={200}
                  max={6000}
                  step={100}
                  value={manualHp}
                  onChange={e => setManualHp(Number(e.target.value))}
                  className="w-full accent-[var(--color-accent)]"
                />
                <div className="flex justify-between text-xs text-foreground-muted mt-0.5">
                  <span>200</span>
                  <span>6,000</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="bg-surface border border-accent/30 rounded-xl p-5">
          <h2 className="text-base font-semibold text-foreground mb-4">📊 Results</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                label: 'Effective Damage',
                value: results.effectiveDamage > 0 ? formatNum(results.effectiveDamage) : '0 (blocked)',
                sub: `Raw: ${formatNum(results.rawDamage)}`,
                highlight: true,
              },
              {
                label: 'DPS',
                value: weapon && weapon.reload > 0 ? formatNum(results.dps) : '—',
                sub: `${weapon?.reload}s reload`,
              },
              {
                label: 'Shots to Kill',
                value: results.shotsToKill === Infinity ? '∞' : results.shotsToKill.toLocaleString(),
                sub: `vs ${targetHp.toLocaleString()} HP`,
              },
              {
                label: 'Angle ×',
                value: isMortar ? '1.00 (ignored)' : `×${formatNum(results.angleMult, 2)}`,
                sub: isMortar ? 'Mortars ignore angle' : `Eff. armor: ${formatNum(results.effectiveArmor, 1)}`,
              },
            ].map(r => (
              <div
                key={r.label}
                className={`rounded-lg p-3 text-center ${r.highlight ? 'bg-accent/10 border border-accent/30' : 'bg-background'}`}
              >
                <div className={`text-xl font-bold ${r.highlight ? 'text-accent' : 'text-foreground'}`}>
                  {r.value}
                </div>
                <div className="text-xs font-medium text-foreground-secondary mt-0.5">{r.label}</div>
                {r.sub && <div className="text-xs text-foreground-muted mt-0.5">{r.sub}</div>}
              </div>
            ))}
          </div>

          {/* Formula explanation */}
          <div className="mt-4 text-xs text-foreground-muted bg-background rounded-lg p-3 space-y-1">
            <p className="font-medium text-foreground-secondary">Formula (from decompiled source)</p>
            <p>
              <code className="text-accent">Damage = max(0, Penetration − EffectiveArmor) × Ammo.DamageFactor</code>
            </p>
            {!isMortar && (
              <p>
                At {angle}°: EffectiveArmor = {formatNum(targetArmor)} × {formatNum(1 + (angle / 90) * 1.5, 2)} = {formatNum(results.effectiveArmor, 2)}
              </p>
            )}
            <p>
              = max(0, {formatNum(weapon?.damage ?? 0)} − {formatNum(results.effectiveArmor, 2)}) × {ammo?.damageFactor} × {isMortar ? '1.00' : formatNum(results.angleMult, 2)} = <strong className="text-foreground">{formatNum(results.effectiveDamage)}</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
