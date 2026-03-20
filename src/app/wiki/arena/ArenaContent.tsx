'use client'

interface ArenaUpgrade {
  Effects: string
  MaxQuantity: number
  Probability: number
}

interface ArenaRewards {
  gold: Record<string, unknown>
  silver: Record<string, unknown>
  bronze: Record<string, unknown>
}

interface ArenaData {
  upgrades: ArenaUpgrade[]
  rewards: ArenaRewards
  mapCount: number
}

function formatEffect(effect: string): string {
  return effect
    .replace(/^Serv/, 'Server: ')
    .replace(/^B/, '')
    .replace(/^P/, '')
    .replace(/^M/, '')
    .replace(/([A-Z])/g, ' $1')
    .replace(/\+/g, ' +')
    .trim()
}

const TIER_STYLES: Record<string, { color: string; icon: string }> = {
  gold:   { color: 'text-amber-400', icon: '🥇' },
  silver: { color: 'text-gray-300', icon: '🥈' },
  bronze: { color: 'text-amber-600', icon: '🥉' },
}

export default function ArenaContent({ arena }: { arena: ArenaData }) {
  return (
    <div className="space-y-8">
      {/* Overview */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <span className="text-accent">⚔️</span> How Arena Works
        </h2>
        <div className="bg-surface border border-surface-border rounded-xl p-5 text-sm text-foreground-secondary space-y-2">
          <p>Arena is a PvP game mode where players battle on dedicated maps. Between rounds, you choose from randomly offered upgrades that buff your ship for the duration of the arena session.</p>
          <p>At the end of each season, players are ranked and receive tier rewards based on their rating.</p>
          <p className="text-foreground-muted">Maps available: <span className="text-accent font-semibold">{arena.mapCount}</span></p>
        </div>
      </section>

      {/* Arena Upgrades */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <span className="text-accent">⬆️</span> Arena Upgrades
          <span className="text-foreground-muted text-sm font-normal">({arena.upgrades.length} types)</span>
        </h2>
        <p className="text-foreground-secondary text-sm mb-4">
          Between rounds, you&apos;re offered random upgrades. Each has a max stack count and a probability of appearing.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {arena.upgrades.map((u, i) => (
            <div key={i} className="bg-surface border border-surface-border rounded-xl p-4">
              <div className="flex items-start justify-between mb-1">
                <span className="text-cyan-400 text-sm font-medium">{formatEffect(u.Effects)}</span>
                <span className="text-foreground-muted text-xs shrink-0 ml-2">×{u.MaxQuantity} max</span>
              </div>
              <div className="flex gap-4 text-xs text-foreground-muted">
                <span>Chance: <span className="text-accent font-mono">{(u.Probability * 100).toFixed(0)}%</span></span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ranked Rewards */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <span className="text-accent">🏆</span> Season Rewards
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {(['gold', 'silver', 'bronze'] as const).map(tier => {
            const data = arena.rewards[tier]
            if (!data) return null
            const style = TIER_STYLES[tier]
            return (
              <div key={tier} className="bg-surface border border-surface-border rounded-xl p-5">
                <h3 className={`text-lg font-bold ${style.color} mb-3 flex items-center gap-2`}>
                  {style.icon} {tier.charAt(0).toUpperCase() + tier.slice(1)}
                </h3>
                <div className="space-y-2 text-sm">
                  {Object.entries(data).map(([key, val]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-foreground-secondary">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()).trim()}
                      </span>
                      <span className="text-accent font-mono text-xs">
                        {typeof val === 'boolean' ? (val ? 'Yes' : 'No') : String(val)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
