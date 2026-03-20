'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { Ship } from '@/lib/gameData'

interface Props {
  ships: Ship[]
}

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

type StatKey = keyof typeof STATS_CONFIG

const STATS_CONFIG = {
  health: { label: 'HP', icon: '❤️', higherIsBetter: true, format: (v: number) => v.toLocaleString() },
  speed: { label: 'Speed', icon: '💨', higherIsBetter: true, format: (v: number) => `${v}` },
  mobility: { label: 'Mobility', icon: '🔄', higherIsBetter: true, format: (v: number) => `${v}` },
  armor: { label: 'Armor', icon: '🛡️', higherIsBetter: true, format: (v: number) => `${v}` },
  capacity: { label: 'Cargo', icon: '📦', higherIsBetter: true, format: (v: number) => v.toLocaleString() },
  crew: { label: 'Crew', icon: '👥', higherIsBetter: true, format: (v: number) => `${v}` },
}

function getBroadside(ship: Ship): number {
  return ship.weaponSlots?.broadside ?? 0
}

export default function ShipCompareClient({ ships }: Props) {
  const [slot1, setSlot1] = useState(String(ships[0]?.gameId ?? ''))
  const [slot2, setSlot2] = useState(String(ships[1]?.gameId ?? ''))
  const [slot3, setSlot3] = useState('')

  const getShip = (id: string) => ships.find(s => String(s.gameId) === id) ?? null

  const selectedShips = useMemo(() => {
    const s = [getShip(slot1), getShip(slot2)]
    if (slot3) s.push(getShip(slot3))
    return s.filter(Boolean) as Ship[]
  }, [slot1, slot2, slot3, ships])

  // Compute max value for each stat (for bar scaling)
  const maxValues = useMemo(() => {
    const result: Partial<Record<StatKey, number>> = {}
    for (const key of Object.keys(STATS_CONFIG) as StatKey[]) {
      result[key] = Math.max(...selectedShips.map(s => ((s as unknown) as Record<string, unknown>)[key] as number ?? 0), 1)
    }
    return result
  }, [selectedShips])

  // Determine winner for each stat
  function getWinner(key: StatKey): number | null {
    if (selectedShips.length < 2) return null
    const vals = selectedShips.map(s => ((s as unknown) as Record<string, unknown>)[key] as number ?? 0)
    const config = STATS_CONFIG[key]
    const best = config.higherIsBetter ? Math.max(...vals) : Math.min(...vals)
    const winners = vals.filter(v => v === best)
    if (winners.length > 1) return null // tie
    return vals.indexOf(best)
  }

  const shipColors = ['text-blue-400', 'text-emerald-400', 'text-amber-400']
  const barColors = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500']
  const winBg = ['bg-blue-500/10', 'bg-emerald-500/10', 'bg-amber-500/10']

  return (
    <div className="space-y-6">
      {/* Ship selectors */}
      <div className="bg-surface border border-surface-border rounded-xl p-5">
        <h2 className="text-sm font-semibold text-foreground-secondary mb-4 uppercase tracking-wider">Select Ships to Compare</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: 'Ship 1', value: slot1, set: setSlot1, required: true },
            { label: 'Ship 2', value: slot2, set: setSlot2, required: true },
            { label: 'Ship 3 (optional)', value: slot3, set: setSlot3, required: false },
          ].map((slot, i) => (
            <div key={i}>
              <label className={`block text-xs font-medium mb-1 ${shipColors[i]}`}>{slot.label}</label>
              <select
                value={slot.value}
                onChange={e => slot.set(e.target.value)}
                className="w-full bg-background border border-surface-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
              >
                {!slot.required && <option value="">— None —</option>}
                {ships.map(s => (
                  <option key={s.gameId} value={String(s.gameId)}>
                    {s.name} ({s.displayClass}, Rate {s.inGameRate})
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {selectedShips.length >= 2 && (
        <>
          {/* Ship header cards */}
          <div className={`grid gap-4 ${selectedShips.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
            {selectedShips.map((ship, i) => (
              <div key={ship.gameId} className="bg-surface border border-surface-border rounded-xl p-4">
                <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${shipColors[i]}`}>
                  Ship {i + 1}
                </div>
                <h3 className="font-bold text-foreground text-lg leading-tight">{ship.name}</h3>
                <div className="text-sm text-foreground-secondary">{ship.inGameClass}</div>
                <div className="mt-3 grid grid-cols-2 gap-1.5 text-xs">
                  <div className="flex justify-between bg-background rounded px-2 py-1">
                    <span className="text-foreground-muted">Class</span>
                    <span className="text-foreground font-medium">{ship.displayClass}</span>
                  </div>
                  <div className="flex justify-between bg-background rounded px-2 py-1">
                    <span className="text-foreground-muted">Rate</span>
                    <span className="text-foreground font-medium">{ship.inGameRate}</span>
                  </div>
                  <div className="flex justify-between bg-background rounded px-2 py-1">
                    <span className="text-foreground-muted">Faction</span>
                    <span className="text-foreground font-medium">{ship.faction}</span>
                  </div>
                  <div className="flex justify-between bg-background rounded px-2 py-1">
                    <span className="text-foreground-muted">Broadside</span>
                    <span className="text-foreground font-medium">{getBroadside(ship)} slots</span>
                  </div>
                  {ship.mortarSlots > 0 && (
                    <div className="flex justify-between bg-background rounded px-2 py-1 col-span-2">
                      <span className="text-foreground-muted">Mortar Slots</span>
                      <span className="text-foreground font-medium">{ship.mortarSlots}</span>
                    </div>
                  )}
                </div>
                <Link
                  href={`/wiki/ships/${toSlug(ship.name)}`}
                  className="mt-3 block text-center text-xs text-accent hover:underline"
                >
                  View detail page →
                </Link>
              </div>
            ))}
          </div>

          {/* Stat comparison */}
          <div className="bg-surface border border-surface-border rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-surface-border">
              <h2 className="text-sm font-semibold text-foreground-secondary uppercase tracking-wider">Stat Comparison</h2>
            </div>
            <div className="divide-y divide-surface-border">
              {(Object.keys(STATS_CONFIG) as StatKey[]).map(key => {
                const config = STATS_CONFIG[key]
                const winner = getWinner(key)
                const maxVal = maxValues[key] ?? 1

                return (
                  <div key={key} className="px-5 py-4">
                    <div className="text-xs font-medium text-foreground-secondary mb-3">
                      {config.icon} {config.label}
                    </div>
                    <div className="space-y-2">
                      {selectedShips.map((ship, i) => {
                        const raw = ((ship as unknown) as Record<string, unknown>)[key] as number ?? 0
                        const pct = maxVal > 0 ? (raw / maxVal) * 100 : 0
                        const isWinner = winner === i
                        const isLoser = winner !== null && winner !== i

                        return (
                          <div key={ship.gameId} className={`rounded-lg px-3 py-2 ${isWinner ? winBg[i] : ''}`}>
                            <div className="flex justify-between text-xs mb-1.5">
                              <span className={`font-medium ${shipColors[i]}`}>{ship.name}</span>
                              <span className={`font-bold ${isWinner ? shipColors[i] : isLoser ? 'text-foreground-muted' : 'text-foreground'}`}>
                                {config.format(raw)}
                                {isWinner && ' ✓'}
                              </span>
                            </div>
                            <div className="h-2 bg-background rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${barColors[i]}`}
                                style={{ width: `${pct}%`, opacity: isLoser ? 0.4 : 1 }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}

              {/* Weapon slots comparison */}
              <div className="px-5 py-4">
                <div className="text-xs font-medium text-foreground-secondary mb-3">⚔️ Weapon Slots</div>
                <div className="space-y-2">
                  {selectedShips.map((ship, i) => {
                    const slots = ship.weaponSlots
                    return (
                      <div key={ship.gameId} className="rounded-lg px-3 py-2 bg-background">
                        <div className={`text-xs font-medium ${shipColors[i]} mb-1`}>{ship.name}</div>
                        <div className="flex flex-wrap gap-2 text-xs text-foreground-secondary">
                          <span>Broadside: <strong className="text-foreground">{slots?.broadside ?? 0}</strong></span>
                          <span>Bow: <strong className="text-foreground">{slots?.bow ?? 0}</strong></span>
                          <span>Stern: <strong className="text-foreground">{slots?.stern ?? 0}</strong></span>
                          {ship.mortarSlots > 0 && (
                            <span>Mortar: <strong className="text-foreground">{ship.mortarSlots}</strong></span>
                          )}
                          {ship.specialWeaponSlots > 0 && (
                            <span>Special: <strong className="text-foreground">{ship.specialWeaponSlots}</strong></span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
