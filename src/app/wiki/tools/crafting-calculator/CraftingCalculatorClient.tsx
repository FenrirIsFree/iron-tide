'use client'

import { useState, useMemo } from 'react'
import type { Ship, Weapon, Resource } from '@/lib/gameData'

interface Props {
  ships: Ship[]
  weapons: Weapon[]
  resources: Resource[]
}

type ItemType = 'ship' | 'weapon'

export default function CraftingCalculatorClient({ ships, weapons, resources }: Props) {
  const [itemType, setItemType] = useState<ItemType>('ship')
  const [shipId, setShipId] = useState(String(ships[0]?.gameId ?? ''))
  const [weaponId, setWeaponId] = useState(weapons[0]?.gameId ?? '')
  const [haveMode, setHaveMode] = useState(false)
  const [haveResources, setHaveResources] = useState<Record<string, number>>({})

  // Resource price lookup
  const resPriceMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of resources) {
      map[r.name] = r.mediumCost
    }
    return map
  }, [resources])

  // Get craftable items
  const craftableShips = useMemo(() =>
    ships.filter(s => s.craftingCost && Object.keys(s.craftingCost).length > 0),
    [ships]
  )

  const craftableWeapons = useMemo(() =>
    weapons.filter(w => w.craftingRecipe && Object.keys(w.craftingRecipe).length > 0),
    [weapons]
  )

  // Current recipe
  const recipe: Record<string, number> = useMemo(() => {
    if (itemType === 'ship') {
      const ship = craftableShips.find(s => String(s.gameId) === shipId)
      return ship?.craftingCost ?? {}
    } else {
      const weapon = craftableWeapons.find(w => w.gameId === weaponId)
      return weapon?.craftingRecipe ?? {}
    }
  }, [itemType, shipId, weaponId, craftableShips, craftableWeapons])

  // Selected item name
  const selectedName = useMemo(() => {
    if (itemType === 'ship') {
      return craftableShips.find(s => String(s.gameId) === shipId)?.name ?? ''
    }
    return craftableWeapons.find(w => w.gameId === weaponId)?.name ?? ''
  }, [itemType, shipId, weaponId, craftableShips, craftableWeapons])

  // Calculate needs
  const needs = useMemo(() => {
    if (!haveMode) return null
    const result: Record<string, { need: number; have: number; still: number }> = {}
    for (const [res, amount] of Object.entries(recipe)) {
      const have = haveResources[res] ?? 0
      result[res] = { need: amount, have, still: Math.max(0, amount - have) }
    }
    return result
  }, [recipe, haveResources, haveMode])

  // Total gold value
  const totalGold = useMemo(() => {
    let total = 0
    for (const [res, amount] of Object.entries(recipe)) {
      total += (resPriceMap[res] ?? 0) * amount
    }
    return total
  }, [recipe, resPriceMap])

  const stillNeededGold = useMemo(() => {
    if (!needs) return 0
    let total = 0
    for (const [res, info] of Object.entries(needs)) {
      total += (resPriceMap[res] ?? 0) * info.still
    }
    return total
  }, [needs, resPriceMap])

  const hasRecipe = Object.keys(recipe).length > 0

  return (
    <div className="space-y-6">
      {/* Item selector */}
      <div className="bg-surface border border-surface-border rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-foreground-secondary uppercase tracking-wider">Select Item to Craft</h2>

        <div className="flex gap-2">
          <button
            onClick={() => setItemType('ship')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              itemType === 'ship' ? 'bg-accent text-background' : 'bg-surface-hover text-foreground-secondary hover:text-foreground'
            }`}
          >
            🚢 Ship
          </button>
          <button
            onClick={() => setItemType('weapon')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              itemType === 'weapon' ? 'bg-accent text-background' : 'bg-surface-hover text-foreground-secondary hover:text-foreground'
            }`}
          >
            🔫 Weapon
          </button>
        </div>

        {itemType === 'ship' ? (
          <div>
            <label className="block text-xs font-medium text-foreground-secondary mb-1">Ship</label>
            <select
              value={shipId}
              onChange={e => setShipId(e.target.value)}
              className="w-full bg-background border border-surface-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
            >
              {craftableShips.map(s => (
                <option key={s.gameId} value={String(s.gameId)}>
                  {s.name} (Rate {s.inGameRate}, {s.displayClass})
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-medium text-foreground-secondary mb-1">Weapon</label>
            <select
              value={weaponId}
              onChange={e => setWeaponId(e.target.value)}
              className="w-full bg-background border border-surface-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
            >
              {craftableWeapons.map(w => (
                <option key={w.gameId} value={w.gameId}>
                  {w.name} ({w.type})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Recipe display */}
      {hasRecipe ? (
        <div className="bg-surface border border-surface-border rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-surface-border flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              📋 {selectedName} — Crafting Cost <span className="text-amber-400 font-normal">(approx.)</span>
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-xs text-foreground-muted">
                Est. value: <span className="text-accent font-bold">{totalGold.toLocaleString()}g</span>
              </span>
              <button
                onClick={() => setHaveMode(v => !v)}
                className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${
                  haveMode ? 'bg-accent text-background' : 'bg-surface-hover text-foreground-secondary hover:text-foreground'
                }`}
              >
                {haveMode ? '✓ Tracking mode ON' : 'Track what I have'}
              </button>
            </div>
          </div>

          <div className="divide-y divide-surface-border">
            {Object.entries(recipe).map(([res, amount]) => {
              const price = resPriceMap[res] ?? 0
              const goldValue = price * amount
              const have = haveResources[res] ?? 0
              const still = Math.max(0, amount - have)
              const pctHave = amount > 0 ? Math.min(100, (have / amount) * 100) : 0
              const complete = haveMode && still === 0

              return (
                <div key={res} className={`px-5 py-3 ${complete ? 'bg-emerald-500/5' : ''}`}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`text-sm font-medium ${complete ? 'text-emerald-400' : 'text-foreground'}`}>
                        {complete && '✓ '}{res}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0 text-sm">
                      <span className="text-foreground font-mono font-bold">{amount.toLocaleString()}</span>
                      {price > 0 && (
                        <span className="text-foreground-muted text-xs">{goldValue.toLocaleString()}g</span>
                      )}
                    </div>
                  </div>

                  {haveMode && (
                    <div className="mt-2 space-y-1.5">
                      <div className="flex items-center gap-3">
                        <label className="text-xs text-foreground-muted w-16 flex-shrink-0">I have:</label>
                        <input
                          type="number"
                          min={0}
                          max={amount}
                          value={have}
                          onChange={e => setHaveResources(prev => ({
                            ...prev,
                            [res]: Math.max(0, Number(e.target.value))
                          }))}
                          className="w-24 bg-background border border-surface-border rounded px-2 py-1 text-xs text-foreground focus:outline-none focus:border-accent"
                        />
                        {still > 0 && (
                          <span className="text-xs text-amber-400">
                            Still need: <strong>{still.toLocaleString()}</strong>
                          </span>
                        )}
                      </div>
                      <div className="h-1.5 bg-background rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                          style={{ width: `${pctHave}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Summary footer */}
          <div className="px-5 py-3 border-t border-surface-border bg-background/50">
            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <span className="text-foreground-muted">Total materials: </span>
                <span className="font-bold text-foreground">{Object.keys(recipe).length} types</span>
              </div>
              <div>
                <span className="text-foreground-muted">Estimated gold value: </span>
                <span className="font-bold text-accent">{totalGold.toLocaleString()}g</span>
              </div>
              {haveMode && (
                <div>
                  <span className="text-foreground-muted">Still needed: </span>
                  <span className="font-bold text-amber-400">{stillNeededGold.toLocaleString()}g</span>
                </div>
              )}
            </div>
            {itemType === 'ship' && (
              <div className="mt-2 space-y-1">
                <p className="text-xs text-amber-400/80 italic">
                  ⚠️ Ship crafting costs are approximate — extracted from decompiled game code. Actual costs may differ. Canvas costs may be missing for some ships.
                </p>
                <p className="text-xs text-foreground-muted">
                  💡 Gold values are estimates based on average market prices. Actual costs vary by port discounts and faction bonuses.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-surface border border-surface-border rounded-xl p-8 text-center text-foreground-muted text-sm">
          No crafting recipe available for this item.
        </div>
      )}
    </div>
  )
}
