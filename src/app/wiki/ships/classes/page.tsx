import { getShips, Ship } from '@/lib/gameData'
import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import SeeAlso from '@/components/wiki/SeeAlso'
import NavBox from '@/components/wiki/NavBox'
import Link from 'next/link'

export const metadata = {
  title: 'Ship Class Trees — The Iron Tide Wiki',
  description: 'Visual ship class trees for all 5 classes in World of Sea Battle — progression from Rate VII to Rate I for Battle, Heavy, Transport, Fast, and Siege.',
}

const CLASS_META: Record<string, { icon: string; gameType: string; desc: string; xpNote?: string }> = {
  Combat: { icon: '⚔️', gameType: 'Battleship', desc: 'Mobile warships built for player vs player combat. High broadside armament, good speed, and balanced armor. The most popular class for PvP.', xpNote: 'Standard XP cost' },
  Heavy: { icon: '🛡️', gameType: 'Hardship', desc: 'Tanky ships of the line with massive broadside firepower and high HP. Slow and difficult to maneuver, but devastating in fleet battles.', xpNote: '+20% XP cost' },
  Transport: { icon: '📦', gameType: 'CargoShip', desc: 'High-capacity cargo haulers with large hold sizes. Still carry weapons but sacrifice combat ability for economy. Best for trading and resource runs.', xpNote: 'Standard XP cost' },
  Fast: { icon: '💨', gameType: 'Destroyer', desc: 'The fastest ships in the game. Lightly armed and armored, but capable of outrunning anything. Used for raiding, intercepting, and escaping.', xpNote: '-20% XP cost (discount)' },
  Siege: { icon: '💣', gameType: 'Mortar', desc: 'Mortar-equipped vessels that excel at bombarding stationary targets — forts, ports, and anchored ships. Unique plunging fire that ignores armor angle.', xpNote: 'Standard XP cost' },
}

const RATE_LABELS: Record<number, string> = {
  7: 'Rate VII',
  6: 'Rate VI',
  5: 'Rate V',
  4: 'Rate IV',
  3: 'Rate III',
  2: 'Rate II',
  1: 'Rate I',
}

const RATE_XP: Record<number, string> = {
  7: 'Free',
  6: '800 XP',
  5: '4,500 XP',
  4: '14,000 XP',
  3: '25,000 XP',
  2: '50,000 XP',
  1: '70,000 XP',
}

function shipSlug(name: string) {
  return name.toLowerCase().replace(/ /g, '-')
}

function acquisitionBadge(ship: Ship) {
  const type = ship.acquisition?.type
  if (type === 'craftable') return { label: 'Craftable', color: 'text-green-400 bg-green-400/10 border-green-500/30' }
  if (type === 'premium') return { label: 'Premium', color: 'text-amber-400 bg-amber-400/10 border-amber-500/30' }
  if (type === 'unique') return { label: 'Unique', color: 'text-purple-400 bg-purple-400/10 border-purple-500/30' }
  if (type === 'empire') return { label: 'Imperial', color: 'text-blue-400 bg-blue-400/10 border-blue-500/30' }
  return { label: type ?? '?', color: 'text-foreground-muted bg-surface border-surface-border' }
}

export default function ShipClassesPage() {
  const ships = getShips()

  // Group ships by displayClass → inGameRate
  const classes = ['Combat', 'Heavy', 'Transport', 'Fast', 'Siege']
  const grouped: Record<string, Record<number, Ship[]>> = {}
  for (const cls of classes) {
    grouped[cls] = {}
    for (let rate = 7; rate >= 1; rate--) {
      grouped[cls][rate] = []
    }
  }
  for (const ship of ships) {
    const cls = ship.displayClass
    const rate = ship.inGameRate
    if (grouped[cls] && grouped[cls][rate] !== undefined) {
      grouped[cls][rate].push(ship)
    }
  }

  return (
    <main className="flex-1 pt-8 pb-12 px-4 max-w-5xl mx-auto w-full">
      <WikiBreadcrumb parent={{ label: 'Ships', href: '/wiki/ships' }} current="Ship Class Trees" />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">🌳 Ship Class Trees</h1>
        <p className="text-foreground-secondary mt-1">
          Progression from Rate VII (starter) to Rate I (top tier) across all 5 ship classes
        </p>
      </div>

      {/* Overview */}
      <div className="mb-8 bg-surface border border-surface-border rounded-xl p-5">
        <h2 className="text-lg font-semibold text-foreground mb-2">How Class Progression Works</h2>
        <p className="text-sm text-foreground-secondary mb-4">
          Each ship class has its own XP tree. Earn Ship XP by fighting in that class — for example, play a Battleship to progress the <strong>Combat</strong> tree. Install all upgrades on your ship to earn XP at 100% efficiency. Completing more branches grants bonus XP to other branches.
        </p>
        <div className="flex flex-wrap gap-2">
          {[7, 6, 5, 4, 3, 2, 1].map(rate => (
            <div key={rate} className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md bg-surface-hover border border-surface-border">
              <span className="text-accent font-bold">{RATE_LABELS[rate]}</span>
              <span className="text-foreground-muted">→</span>
              <span className="text-foreground font-mono">{RATE_XP[rate]}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-foreground-muted mt-3">
          Fast class (Destroyer) ships get a <strong>-20% XP discount</strong>. Heavy class (Hardship) ships cost <strong>+20% more XP</strong>.
        </p>
      </div>

      {/* Class Trees */}
      {classes.map(cls => {
        const meta = CLASS_META[cls]
        const classShips = grouped[cls]
        const totalShips = Object.values(classShips).flat().length
        if (totalShips === 0) return null

        return (
          <section key={cls} className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{meta.icon}</span>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{cls} Class</h2>
                <p className="text-xs text-foreground-muted">{meta.gameType} · {totalShips} ships · {meta.xpNote}</p>
              </div>
            </div>
            <p className="text-sm text-foreground-secondary mb-5">{meta.desc}</p>

            <div className="space-y-3">
              {[7, 6, 5, 4, 3, 2, 1].map(rate => {
                const rateShips = classShips[rate]
                if (rateShips.length === 0) return null

                return (
                  <div key={rate} className="flex gap-3">
                    {/* Rate label */}
                    <div className="flex-shrink-0 w-20 flex items-start pt-2">
                      <div className={`text-xs font-bold px-2 py-1 rounded border w-full text-center ${
                        rate === 1 ? 'text-accent border-accent/40 bg-accent/10' :
                        rate <= 3 ? 'text-foreground border-surface-border bg-surface-hover' :
                        'text-foreground-muted border-surface-border bg-surface'
                      }`}>
                        Rate {['VII', 'VI', 'V', 'IV', 'III', 'II', 'I'][7 - rate]}
                      </div>
                    </div>

                    {/* Ships in this rate */}
                    <div className="flex-1 flex flex-wrap gap-2">
                      {rateShips.sort((a, b) => a.name.localeCompare(b.name)).map(ship => {
                        const badge = acquisitionBadge(ship)
                        return (
                          <Link
                            key={ship.gameId}
                            href={`/wiki/ships/${shipSlug(ship.name)}`}
                            className="group flex flex-col gap-1 bg-surface border border-surface-border rounded-lg px-3 py-2 hover:border-accent/50 hover:bg-surface-hover transition-colors min-w-[160px] max-w-[220px]"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-sm font-medium text-foreground group-hover:text-accent transition-colors leading-tight">
                                {ship.name}
                              </span>
                              <span className={`text-xs px-1.5 py-0.5 rounded border flex-shrink-0 ${badge.color}`}>
                                {badge.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-foreground-muted">
                              <span>❤️ {ship.health.toLocaleString()}</span>
                              <span>💨 {ship.speed}</span>
                              <span>🛡️ {ship.armor}</span>
                            </div>
                            <div className="text-xs text-foreground-muted">
                              {ship.faction}
                            </div>
                          </Link>
                        )
                      })}
                    </div>

                    {/* Connector line (except for Rate I) */}
                    {rate > 1 && classShips[rate - 1]?.length > 0 && (
                      <div className="absolute" />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Progression arrow between rates */}
            <div className="mt-3 text-xs text-foreground-muted flex items-center gap-2">
              <span>Rate VII (starter)</span>
              <span className="text-foreground-muted">────────────────→</span>
              <span className="text-accent font-semibold">Rate I (top tier)</span>
            </div>
          </section>
        )
      })}

      <SeeAlso items={[
        { title: '🚢 Ship Database', href: '/wiki/ships', description: 'Full stats for all 62 ships' },
        { title: '🏴 Faction Guide', href: '/wiki/factions', description: 'Ships grouped by faction — playstyle and lore' },
        { title: '🔨 Crafting', href: '/wiki/crafting', description: 'How to craft ships from Bulkhead, Beam, and Plate' },
        { title: '🧭 Captain Skills', href: '/wiki/skills', description: 'Skills that boost Ship XP gain' },
        { title: '⭐ Ranks', href: '/wiki/ranks', description: 'Rank requirements for high-tier ships' },
        { title: '🛠️ Tools: Ship Compare', href: '/wiki/tools/ship-compare', description: 'Compare ships side-by-side' },
      ]} />
      <NavBox
        category="Ships"
        icon="🚢"
        items={[
          { label: 'Ship Database', href: '/wiki/ships' },
          { label: 'Ship Class Trees', href: '/wiki/ships/classes' },
          { label: 'Faction Guide', href: '/wiki/factions' },
          { label: 'Crafting', href: '/wiki/crafting' },
        ]}
      />
    </main>
  )
}
