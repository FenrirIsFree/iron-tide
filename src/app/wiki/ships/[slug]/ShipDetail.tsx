'use client'

import Link from 'next/link'

interface WeaponSlots {
  stern: number
  broadside: number
  bow: number
}

interface Ship {
  gameId: number
  name: string
  description: string
  health: number
  speed: number
  mobility: number
  armor: number
  capacity: number
  crew: number
  rank: number
  gameType: string
  displayClass: string
  subtype: string
  coolness: string
  faction: string
  gameFaction: string
  extraUpgradeSlots: number
  costReal: number
  canBeNpc: boolean
  requiredRank: number
  canBeUsedForNpc: boolean
  broadsideArmor: number
  hold: number
  displacement: string
  integrity: number
  weaponSlots: WeaponSlots | null
  swivelGuns: number
  mortarSlots: number
  specialWeaponSlots: number
  role: string
  inGameClass: string
  inGameRate: number
  bonuses: string[]
  acquisition: { type: string; imperialChestOnly?: boolean }
  chestSources?: { chest: string; dropRate: number | null; category: string }[]
  craftingCost?: Record<string, number>
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']

const FACTION_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  Antilian:  { bg: 'bg-blue-900/30', text: 'text-blue-400', border: 'border-blue-800' },
  Eastern:   { bg: 'bg-purple-900/30', text: 'text-purple-400', border: 'border-purple-800' },
  Imperial:  { bg: 'bg-amber-900/30', text: 'text-amber-400', border: 'border-amber-800' },
  Spanish:   { bg: 'bg-red-900/30', text: 'text-red-400', border: 'border-red-800' },
}

const FACTION_NAMES: Record<string, string> = {
  Antilian: 'Antilia',
  Eastern: 'Kai & Severia',
  Imperial: 'Empire',
  Spanish: 'Espaniol',
}

function formatSubtype(subtype: string): string {
  return subtype.replace('subclass_', '').replace(/^./, s => s.toUpperCase())
}

function StatCard({ icon, label, value, sub }: { icon: string; label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-surface border border-surface-border rounded-xl p-4 flex flex-col items-center text-center">
      <span className="text-2xl mb-1">{icon}</span>
      <span className="text-accent font-bold text-xl">{value}</span>
      <span className="text-foreground-secondary text-xs mt-1">{label}</span>
      {sub && <span className="text-foreground-muted text-xs">{sub}</span>}
    </div>
  )
}

function SlotBar({ label, count, max, color }: { label: string; count: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min((count / max) * 100, 100) : 0
  return (
    <div className="flex items-center gap-3">
      <span className="text-foreground-secondary text-sm w-24 text-right">{label}</span>
      <div className="flex-1 h-3 bg-surface-hover rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-foreground font-mono text-sm w-8">{count}</span>
    </div>
  )
}

interface ShipDetailProps {
  ship: Ship
  prev: { name: string; slug: string } | null
  next: { name: string; slug: string } | null
}

export default function ShipDetail({ ship, prev, next }: ShipDetailProps) {
  const factionStyle = FACTION_STYLES[ship.faction] || FACTION_STYLES.Antilian
  const factionName = FACTION_NAMES[ship.faction] || ship.faction
  const rate = ROMAN[ship.inGameRate] ?? `${ship.inGameRate + 1}`
  const ws = ship.weaponSlots ?? { broadside: 0, stern: 0, bow: 0 }
  const totalWeaponSlots = ws.broadside + ws.stern + ws.bow
  const maxSlots = Math.max(totalWeaponSlots, ship.swivelGuns, ship.mortarSlots, 1)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{ship.name}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-2 text-sm">
            {ship.inGameClass && (
              <span className="text-foreground-secondary">{ship.inGameClass}</span>
            )}
            <span className="text-foreground-muted">•</span>
            <span className="text-foreground-secondary">{ship.displayClass}</span>
            <span className="text-foreground-muted">•</span>
            <span className="text-accent font-semibold">Rate {rate}</span>
            {ship.subtype && ship.subtype !== 'subclass_' && (
              <>
                <span className="text-foreground-muted">•</span>
                <span className="text-foreground-secondary">{formatSubtype(ship.subtype)}</span>
              </>
            )}
          </div>
          {ship.description && (
            <p className="text-foreground-secondary text-sm mt-3 max-w-2xl italic leading-relaxed">
              {ship.description}
            </p>
          )}
        </div>
        <div className={`px-4 py-2 rounded-lg border ${factionStyle.bg} ${factionStyle.border} shrink-0`}>
          <span className={`text-sm font-semibold ${factionStyle.text}`}>{factionName}</span>
        </div>
      </div>

      {/* Core Stats */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <span className="text-accent">⚓</span> Core Stats
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          <StatCard icon="❤️" label="Hit Points" value={ship.health.toLocaleString()} />
          <StatCard icon="⛵" label="Speed" value={ship.speed} />
          <StatCard icon="🔄" label="Mobility" value={ship.mobility} />
          <StatCard icon="🛡️" label="Armor" value={ship.armor} sub={ship.broadsideArmor !== ship.armor ? `Broadside: ${ship.broadsideArmor}` : undefined} />
          <StatCard icon="📦" label="Hold" value={ship.hold.toLocaleString()} />
          <StatCard icon="👥" label="Crew" value={ship.crew} />
          <StatCard icon="⚖️" label="Displacement" value={ship.displacement || '—'} />
          <StatCard icon="🔧" label="Integrity" value={ship.integrity} />
          <StatCard icon="⚓" label="Ship Rate" value={`Rate ${['I','II','III','IV','V','VI','VII'][ship.inGameRate - 1] ?? ship.inGameRate}`} />
        </div>
      </section>

      {/* Weapon Loadout */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <span className="text-accent">🔫</span> Weapon Loadout
        </h2>
        <div className="bg-surface border border-surface-border rounded-xl p-5 space-y-3">
          <SlotBar label="Broadside" count={ws.broadside} max={maxSlots} color="bg-red-500" />
          <SlotBar label="Bow" count={ws.bow} max={maxSlots} color="bg-blue-500" />
          <SlotBar label="Stern" count={ws.stern} max={maxSlots} color="bg-amber-500" />
          <div className="border-t border-surface-border my-2" />
          <SlotBar label="Swivel Guns" count={ship.swivelGuns} max={maxSlots} color="bg-green-500" />
          {ship.mortarSlots > 0 && (
            <SlotBar label="Mortar" count={ship.mortarSlots} max={maxSlots} color="bg-purple-500" />
          )}
          {ship.specialWeaponSlots > 0 && (
            <SlotBar label="Special" count={ship.specialWeaponSlots} max={maxSlots} color="bg-cyan-500" />
          )}
          {ship.extraUpgradeSlots > 0 && (
            <div className="text-foreground-secondary text-sm mt-2">
              +{ship.extraUpgradeSlots} extra upgrade slot{ship.extraUpgradeSlots > 1 ? 's' : ''}
            </div>
          )}
          <div className="text-foreground-muted text-xs mt-2">
            Total cannon slots: {totalWeaponSlots}
          </div>
        </div>
      </section>

      {/* Acquisition */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <span className="text-accent">🏗️</span> Acquisition
        </h2>
        <div className="bg-surface border border-surface-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-foreground-secondary text-sm">How to get:</span>
            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
              ship.acquisition.type === 'craftable' ? 'bg-green-900/40 text-green-400 border border-green-800' :
              ship.acquisition.type === 'premium' ? 'bg-amber-900/40 text-amber-400 border border-amber-800' :
              ship.acquisition.type === 'chest' ? 'bg-purple-900/40 text-purple-400 border border-purple-800' :
              'bg-surface-hover text-foreground-secondary border border-surface-border'
            }`}>
              {ship.acquisition.type === 'craftable' ? '🔨 Craftable' :
               ship.acquisition.type === 'premium' ? '💎 Premium' :
               ship.acquisition.type === 'chest' ? '🎁 Chest Only' :
               ship.acquisition.type.charAt(0).toUpperCase() + ship.acquisition.type.slice(1)}
            </span>
          </div>

          {ship.craftingCost && Object.keys(ship.craftingCost).length > 0 && (
            <div>
              <h3 className="text-foreground text-sm font-semibold mb-2">Crafting Cost</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(ship.craftingCost).map(([resource, amount]) => (
                  <div key={resource} className="flex items-center justify-between bg-surface-hover rounded-lg px-3 py-2">
                    <span className="text-foreground-secondary text-sm">{resource}</span>
                    <span className="text-accent font-mono text-sm font-semibold">{amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {ship.chestSources && ship.chestSources.length > 0 && (
            <div className="mt-3">
              <h3 className="text-foreground text-sm font-semibold mb-2">Available From</h3>
              <div className="space-y-1">
                {ship.chestSources.map((src, i) => (
                  <div key={i} className="flex items-center justify-between bg-surface-hover rounded-lg px-3 py-2 text-sm">
                    <span className="text-foreground-secondary">{src.chest}</span>
                    {src.dropRate !== null && (
                      <span className="text-accent font-mono">{(src.dropRate * 100).toFixed(1)}%</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {ship.costReal > 0 && (
            <div className="mt-3 text-foreground-secondary text-sm">
              Premium price: <span className="text-accent font-semibold">{ship.costReal} doubloons</span>
            </div>
          )}
        </div>
      </section>

      {/* Additional Info */}
      {(ship.bonuses.length > 0 || ship.canBeNpc || ship.coolness) && (
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="text-accent">📋</span> Additional Info
          </h2>
          <div className="bg-surface border border-surface-border rounded-xl p-5 space-y-2 text-sm">
            {ship.bonuses.length > 0 && (
              <div className="flex gap-2">
                <span className="text-foreground-secondary w-28 shrink-0">Bonuses:</span>
                <span className="text-foreground">{ship.bonuses.join(', ')}</span>
              </div>
            )}
            <div className="flex gap-2">
              <span className="text-foreground-secondary w-28 shrink-0">Can be NPC:</span>
              <span className={ship.canBeNpc ? 'text-green-400' : 'text-foreground-muted'}>
                {ship.canBeNpc ? 'Yes' : 'No'}
              </span>
            </div>
            {ship.coolness && ship.coolness !== 'Default' && (
              <div className="flex gap-2">
                <span className="text-foreground-secondary w-28 shrink-0">Rarity:</span>
                <span className="text-accent">
                  {ship.coolness.replace('Default ', '').replace('SailageLegend', 'Sailage Legend')}
                </span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Prev/Next Navigation */}
      <nav className="flex justify-between items-center pt-4 border-t border-surface-border">
        {prev ? (
          <Link
            href={`/wiki/ships/${prev.slug}`}
            className="text-foreground-secondary hover:text-accent transition-colors text-sm"
          >
            ← {prev.name}
          </Link>
        ) : <span />}
        <Link
          href="/wiki/ships"
          className="text-foreground-muted hover:text-foreground-secondary transition-colors text-xs"
        >
          All Ships
        </Link>
        {next ? (
          <Link
            href={`/wiki/ships/${next.slug}`}
            className="text-foreground-secondary hover:text-accent transition-colors text-sm"
          >
            {next.name} →
          </Link>
        ) : <span />}
      </nav>
    </div>
  )
}
