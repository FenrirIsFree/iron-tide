import { getShips, Ship } from '@/lib/gameData'
import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import SeeAlso from '@/components/wiki/SeeAlso'
import NavBox from '@/components/wiki/NavBox'
import Link from 'next/link'

export const metadata = {
  title: 'Faction Guide — The Iron Tide Wiki',
  description: 'All player factions in World of Sea Battle — available ships, lore overview, and playstyle for Antilian, Spanish, Eastern, Imperial, and Pirate factions.',
}

interface FactionMeta {
  displayName: string
  gameFaction: string
  icon: string
  lore: string
  playstyle: string
  strengths: string[]
  weaknesses: string[]
  taxNote?: string
}

const FACTION_META: FactionMeta[] = [
  {
    displayName: 'Antilian Republic',
    gameFaction: 'Antilia',
    icon: '🏴',
    lore: 'The Antilian Republic is a loose confederation of port cities and merchant guilds that fought for independence from colonial powers. Pragmatic and adaptive, they field a diverse fleet drawing on ships from across the world\'s naval history. Their flagship warships — Victory and Sovereign — are some of the most battle-tested vessels in the Archipelago.',
    playstyle: 'Balanced and flexible. Antilian ships cover all roles well, making this the most beginner-friendly faction. Their Rate I ships are craftable, so you aren\'t locked behind premium purchases to reach the top tier.',
    strengths: ['Strong Rate I craftable ships (Victory)', 'Diverse fleet options', 'Good balance of speed and firepower', 'Recommended for new players'],
    weaknesses: ['No standout faction bonuses', 'Less extreme specialization than other factions'],
  },
  {
    displayName: 'Spanish Empire',
    gameFaction: 'Espaniol',
    icon: '⚜️',
    lore: 'The Spanish Empire represents the old colonial powers — disciplined, heavily armed, and proud. Their ships of the line were the terror of the Atlantic, combining massive firepower with the prestige of the world\'s greatest naval tradition. The Santisima Trinidad, the largest warship of her era, sails under their colors.',
    playstyle: 'Firepower-focused. Spanish ships have high broadside weapon counts and strong armor on their largest vessels. The Heavy class in particular excels here — if you want to park broadside and unleash devastation, this is your faction.',
    strengths: ['Highest broadside cannon counts at top rates', 'Strong Heavy class ships', 'Santisima Trinidad bonus: +15% XP and loot', 'Redoutable and La Couronne are excellent craft ships'],
    weaknesses: ['Rate I heavy ships are slower', 'Less speed-focused than Eastern or Antilian'],
  },
  {
    displayName: 'Eastern Alliance',
    gameFaction: 'KaiAndSeveria',
    icon: '🌅',
    lore: 'The Eastern Alliance is a coalition of Kai and Severian states that control the eastern reaches of the Archipelago. Their fleet combines Russian Imperial warships with unique Severian designs. The 12 Apostolov, a legendary ship of the Black Sea Fleet, exemplifies their design philosophy: sturdy, powerful, and built for endurance.',
    playstyle: 'Economy and endurance. Eastern ships tend toward durability and cargo capacity. The faction suits players who want to build a trading empire alongside their combat career. Their crafting and resource production bonuses make them excellent long-term players.',
    strengths: ['12 Apostolov: legendary Rate I Heavy ship', 'Good Transport class options (La Couronne-equivalent routes)', 'Strong crafting infrastructure', 'Ingermanland is one of the best Rate II Fast ships'],
    weaknesses: ['Fewer premium/unique options at low rates', 'Top-tier ships require high rank'],
  },
  {
    displayName: 'Imperial Faction',
    gameFaction: 'Empire',
    icon: '👑',
    lore: 'The Imperial Faction represents the mysterious Inhagger Empire — a native civilization whose technological sophistication rivals the colonial powers. Their ships are alien to Archipelago standards: unique wind roses, invisibility systems, and the ability to pass through Imperial NPC patrols unchallenged. The Huracan is their crown jewel — an 8,000 HP behemoth with no equal in raw durability.',
    playstyle: 'Unique mechanics and elite ships. Imperial ships are acquired through Legend Tokens and Escudo — not crafting. They offer abilities no other faction provides (invisibility, mobile outpost, NPC immunity). Best for experienced players who want something different.',
    strengths: ['Huracan: highest HP in game (8,000)', 'Unique abilities: invisibility, mobile outpost', 'Imperial NPCs do not attack', 'Extra upgrade slots on flagship ships'],
    weaknesses: ['Ships cost Legend Tokens + Escudo (hard to acquire)', 'Not beginner-friendly', 'Limited fleet variety'],
    taxNote: 'Imperial ships require Legend Tokens earned through high-rank play.',
  },
  {
    displayName: 'Pirates',
    gameFaction: 'Pirate',
    icon: '☠️',
    lore: 'Pirates operate outside any national allegiance, raiding merchant lanes and port-hopping across the Archipelago. They have access to Pirate Bays — neutral ports that any faction can use but that pirates control — and the exclusive Pirate Trader, who offers rare goods for Escudo currency.',
    playstyle: 'Freedom and aggression. Pirates have no faction loyalty, meaning they can attack anyone — but also be attacked by anyone. Guild mechanics work differently; pirate ports have unique bonuses including better powerup crafting and ship deconstruction returns.',
    strengths: ['Access to Pirate Trader (Escudo currency for rare items)', 'Pirate port bonuses: powerup craft discount, fast recovery', 'Fleet flexibility — no faction restrictions on ship use', 'Unique AllFractionShipsCraftNoPenalty at port level 4+'],
    weaknesses: ['Hostile to all factions — no safe ports except Pirate Bays', 'Cannot open Trade HQ (Traders can\'t set up HQ in pirate ports)', 'Recommended for experienced players only'],
    taxNote: 'Pirate players face double taxes when trading in enemy faction ports (2× penalty).',
  },
]

function shipSlug(name: string) {
  return name.toLowerCase().replace(/ /g, '-')
}

function acquisitionLabel(ship: Ship) {
  const type = ship.acquisition?.type
  if (type === 'craftable') return '🔨'
  if (type === 'premium') return '💰'
  if (type === 'unique') return '⭐'
  if (type === 'empire') return '👑'
  return '?'
}

export default function FactionsPage() {
  const ships = getShips()

  // Group ships by gameFaction
  const shipsByFaction: Record<string, Ship[]> = {}
  for (const ship of ships) {
    const faction = ship.gameFaction
    if (!shipsByFaction[faction]) shipsByFaction[faction] = []
    shipsByFaction[faction].push(ship)
  }

  // Sort ships within each faction by rate (ascending = better ships first)
  for (const faction of Object.keys(shipsByFaction)) {
    shipsByFaction[faction].sort((a, b) => a.inGameRate - b.inGameRate || a.name.localeCompare(b.name))
  }

  return (
    <main className="flex-1 pt-8 pb-12 px-4 max-w-5xl mx-auto w-full">
      <WikiBreadcrumb current="Faction Guide" />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">🏴 Faction Guide</h1>
        <p className="text-foreground-secondary mt-1">
          Choose your allegiance — ships, lore, and playstyle for each faction
        </p>
      </div>

      {/* Quick comparison */}
      <div className="mb-8 bg-surface border border-surface-border rounded-xl p-5 overflow-x-auto">
        <h2 className="text-lg font-semibold text-foreground mb-3">Faction at a Glance</h2>
        <table className="w-full text-sm border-collapse min-w-[480px]">
          <thead>
            <tr className="border-b border-surface-border text-left">
              <th className="pb-2 pr-4 font-semibold text-foreground">Faction</th>
              <th className="pb-2 pr-4 font-semibold text-foreground">Best for</th>
              <th className="pb-2 pr-4 font-semibold text-foreground">Top ship</th>
              <th className="pb-2 font-semibold text-foreground">Difficulty</th>
            </tr>
          </thead>
          <tbody className="text-foreground-secondary">
            {[
              { faction: '🏴 Antilian', best: 'New players, all-rounders', top: 'Victory (Rate I Battle)', diff: '⭐ Easy' },
              { faction: '⚜️ Spanish', best: 'Firepower, fleet battles', top: 'Santisima Trinidad (Rate I Heavy)', diff: '⭐⭐ Medium' },
              { faction: '🌅 Eastern', best: 'Economy, endurance', top: '12 Apostolov (Rate I Heavy)', diff: '⭐⭐ Medium' },
              { faction: '👑 Imperial', best: 'Unique mechanics, elite play', top: 'Huracan (8,000 HP Rate I)', diff: '⭐⭐⭐ Hard' },
              { faction: '☠️ Pirate', best: 'Freedom, aggression', top: 'Any faction ship', diff: '⭐⭐⭐ Hard' },
            ].map(r => (
              <tr key={r.faction} className="border-b border-surface-border/50">
                <td className="py-2 pr-4">{r.faction}</td>
                <td className="py-2 pr-4">{r.best}</td>
                <td className="py-2 pr-4">{r.top}</td>
                <td className="py-2 text-foreground-muted">{r.diff}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Faction sections */}
      {FACTION_META.map(faction => {
        const factionShips = shipsByFaction[faction.gameFaction] ?? []

        return (
          <section key={faction.gameFaction} className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{faction.icon}</span>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{faction.displayName}</h2>
                <p className="text-xs text-foreground-muted">{factionShips.length} ships</p>
              </div>
            </div>

            {/* Lore */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-foreground-secondary uppercase tracking-wide mb-2">Lore</h3>
              <p className="text-foreground-secondary text-sm leading-relaxed">{faction.lore}</p>
            </div>

            {/* Playstyle */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-foreground-secondary uppercase tracking-wide mb-2">Playstyle</h3>
              <p className="text-foreground-secondary text-sm leading-relaxed">{faction.playstyle}</p>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              <div className="bg-surface border border-green-500/30 rounded-lg p-4">
                <p className="text-sm font-semibold text-green-400 mb-2">Strengths</p>
                <ul className="space-y-1">
                  {faction.strengths.map(s => (
                    <li key={s} className="text-sm text-foreground-secondary flex gap-2">
                      <span className="text-green-400 flex-shrink-0">+</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-surface border border-red-500/30 rounded-lg p-4">
                <p className="text-sm font-semibold text-red-400 mb-2">Weaknesses</p>
                <ul className="space-y-1">
                  {faction.weaknesses.map(w => (
                    <li key={w} className="text-sm text-foreground-secondary flex gap-2">
                      <span className="text-red-400 flex-shrink-0">−</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {faction.taxNote && (
              <div className="mb-5 border-l-4 border-amber-500 bg-amber-500/10 rounded-r-lg px-4 py-3">
                <p className="text-sm text-amber-300">{faction.taxNote}</p>
              </div>
            )}

            {/* Ship list */}
            {factionShips.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-foreground-secondary uppercase tracking-wide mb-3">
                  Available Ships ({factionShips.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {factionShips.map(ship => (
                    <Link
                      key={ship.gameId}
                      href={`/wiki/ships/${shipSlug(ship.name)}`}
                      className="group flex items-start gap-3 bg-surface border border-surface-border rounded-lg px-3 py-2.5 hover:border-accent/50 hover:bg-surface-hover transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors truncate">
                            {ship.name}
                          </p>
                          <span className="text-xs text-foreground-muted flex-shrink-0">
                            {acquisitionLabel(ship)} Rate {['I','II','III','IV','V','VI','VII'][ship.inGameRate - 1] || ship.inGameRate}
                          </span>
                        </div>
                        <p className="text-xs text-foreground-muted mt-0.5">
                          {ship.displayClass} · {ship.inGameClass}
                        </p>
                        <div className="flex gap-2 text-xs text-foreground-muted mt-1">
                          <span>❤️ {ship.health.toLocaleString()}</span>
                          <span>💨 {ship.speed}</span>
                          <span>🛡️ {ship.armor}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <p className="text-xs text-foreground-muted mt-2">
                  🔨 Craftable  💰 Premium  ⭐ Unique  👑 Imperial
                </p>
              </div>
            )}
          </section>
        )
      })}

      <SeeAlso items={[
        { title: '🚀 Getting Started', href: '/wiki/getting-started', description: 'New to WoSB? Start here' },
        { title: '🚢 Ship Database', href: '/wiki/ships', description: 'Full stats for all 62 ships' },
        { title: '🌳 Ship Class Trees', href: '/wiki/ships/classes', description: 'Progression from Rate VII to Rate I' },
        { title: '⚜️ Guilds', href: '/wiki/guilds', description: 'Guild mechanics and faction warfare' },
        { title: '⚓ Ports', href: '/wiki/ports', description: 'Port ownership and faction territories' },
        { title: '💰 Economy Guide', href: '/wiki/economy', description: 'Trading and crafting by faction' },
      ]} />
      <NavBox
        category="Getting Started"
        icon="🚀"
        items={[
          { label: 'Getting Started', href: '/wiki/getting-started' },
          { label: 'Faction Guide', href: '/wiki/factions' },
          { label: 'Ship Database', href: '/wiki/ships' },
          { label: 'Ship Class Trees', href: '/wiki/ships/classes' },
          { label: 'Guilds', href: '/wiki/guilds' },
        ]}
      />
    </main>
  )
}
