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
    displayName: 'Dominion of Antilia',
    gameFaction: 'Antilia',
    icon: '🏴',
    lore: 'The British Dominion of Antilia was founded by descendants of English and German colonists. Current ruler: Lord Protector John Campbell. Under his command, you expand faction territory, develop cities, complete missions to earn influence, and contribute to seasonal victory. Allied cities offer combat and economic bonuses.',
    playstyle: 'Balanced and flexible. Antilian ships cover all roles well, making this the most beginner-friendly faction. Their Rate I ships are craftable, so you aren\'t locked behind premium purchases to reach the top tier.',
    strengths: ['Strong Rate I craftable ships (Victory)', 'Diverse fleet options', 'Good balance of speed and firepower', 'Recommended for new players'],
    weaknesses: ['No standout faction bonuses', 'Less extreme specialization than other factions'],
  },
  {
    displayName: 'Viceroyalty of Espaniol',
    gameFaction: 'Espaniol',
    icon: '⚜️',
    lore: 'The Viceroyalty of Espaniol was founded by descendants of Spanish, French, and Dutch colonists. Its head of state is Viceroy Alfonso III de Castro. Under his command, you expand faction territory, develop cities, complete missions to earn influence, and contribute to seasonal victory. Allied cities grant various economic and combat bonuses.',
    playstyle: 'Firepower-focused. Espaniol ships have high broadside weapon counts and strong armor on their largest vessels. If you want to park broadside and unleash devastation, this is your faction.',
    strengths: ['Highest broadside cannon counts at top rates', 'Strong Heavy class ships', 'Santisima Trinidad: massive Rate I ship', 'Redoutable and La Couronne are excellent craft ships'],
    weaknesses: ['Rate I heavy ships are slower', 'Less speed-focused than other factions'],
  },
  {
    displayName: 'Kai & Severia',
    gameFaction: 'KaiAndSeveria',
    icon: '🌅',
    lore: 'A dynastic union formed through the marriage of Princess Lau Mi of the Kingdom of Kai and Afanasy Galitsyn, governor of the Severian Republic. The union blends Eastern philosophy and Northern resilience. Under their banner, you expand territory, grow cities, complete missions, earn influence, and push for seasonal victory.',
    playstyle: 'Economy and endurance. Kai & Severia ships tend toward durability and cargo capacity. The faction suits players who want to build a trading empire alongside their combat career. Their crafting and resource production bonuses make them excellent long-term players.',
    strengths: ['12 Apostolov: legendary Rate I Heavy ship', 'Good Transport class options', 'Strong crafting infrastructure', 'Ingermanland is one of the best Rate II Fast ships'],
    weaknesses: ['Fewer premium/unique options at low rates', 'Top-tier ships require high rank'],
  },
  {
    displayName: 'The Empire',
    gameFaction: 'Empire',
    icon: '👑',
    lore: 'The Empire is a powerful NPC state seeking to reclaim the archipelago. Technologically advanced in shipbuilding, they periodically launch fleet assaults on faction-held ports. Imperial ships are acquired through Legend Tokens and Escudo, not crafting.',
    playstyle: 'Unique mechanics and elite ships. Imperial ships offer abilities no other faction provides. Best for experienced players who want something different.',
    strengths: ['Huracan: highest HP in game (8,000)', 'Unique ship abilities', 'Extra upgrade slots on flagship ships'],
    weaknesses: ['Ships cost Legend Tokens + Escudo (hard to acquire)', 'Not beginner-friendly', 'Limited fleet variety'],
    taxNote: 'Imperial ships require Legend Tokens earned through high-rank play.',
  },
  {
    displayName: 'Trade Union',
    gameFaction: 'TradeUnion',
    icon: '💰',
    lore: 'The Trade Union is a merchant faction focused on commerce rather than conquest. Trade Union guilds cannot capture military ports, but they contest Caliphate ports through a tender system. They are neutral toward all factions except Pirates.',
    playstyle: 'Commerce-focused. The Trade Union is for players who want to focus on trading, crafting, and economy rather than PvP warfare. Neutral standing with military factions means safer trade routes.',
    strengths: ['Neutral to all military factions — safer trading', 'Contest Caliphate ports via tender system', 'Focus on economic gameplay'],
    weaknesses: ['Cannot capture regular ports', 'Hostile with Pirates', 'Limited PvP engagement'],
  },
  {
    displayName: 'Pirates',
    gameFaction: 'Pirate',
    icon: '☠️',
    lore: 'Pirates operate outside any national allegiance, raiding merchant lanes and port-hopping across the Archipelago. They control exclusive Pirate Coves — strongholds that can only be owned by pirate guilds. They have access to the Pirate Trader, who offers rare goods for Escudo currency.',
    playstyle: 'Freedom and aggression. Pirates can attack anyone — but are also hostile to everyone. Pirate ports have unique bonuses including better powerup crafting and ship deconstruction returns. Recommended for experienced players only.',
    strengths: ['Access to Pirate Trader (Escudo for rare items)', 'Exclusive Pirate Coves (Tortuga, Pirate City, etc.)', 'Fleet flexibility — no faction restrictions on ship use', 'Pirate port bonuses: powerup discount, fast recovery'],
    weaknesses: ['Hostile to ALL other factions', 'Cannot open Trade HQ in pirate ports', 'Limited safe harbors'],
    taxNote: 'Pirate players face double taxes when trading in enemy faction ports.',
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
              { faction: '🏴 Antilia', best: 'New players, all-rounders', top: 'Victory (Rate I Battle)', diff: '⭐ Easy' },
              { faction: '⚜️ Espaniol', best: 'Firepower, fleet battles', top: 'Santisima Trinidad (Rate I)', diff: '⭐⭐ Medium' },
              { faction: '🌅 Kai & Severia', best: 'Economy, endurance', top: '12 Apostolov (Rate I)', diff: '⭐⭐ Medium' },
              { faction: '💰 Trade Union', best: 'Trading, commerce', top: 'Any faction ship', diff: '⭐⭐ Medium' },
              { faction: '☠️ Pirates', best: 'Freedom, aggression', top: 'Any faction ship', diff: '⭐⭐⭐ Hard' },
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

      {/* Diplomatic Relations */}
      <div className="mb-10">
        <h2 id="diplomacy" className="text-xl font-bold text-foreground mb-3">🤝 Diplomatic Relations</h2>
        <p className="text-foreground-secondary text-sm mb-4">
          Each faction has default diplomatic relations. Additionally, every player has individual reputation with the three military factions.
        </p>
        <ul className="list-disc list-inside text-foreground-secondary text-sm space-y-2 mb-4">
          <li>Players not in any faction are considered <span className="text-foreground font-medium">neutral</span></li>
          <li>The three <span className="text-foreground font-medium">military factions</span> (Antilia, Espaniol, Kai & Severia) are <span className="text-red-400">at war</span> with each other</li>
          <li>The <span className="text-foreground font-medium">Trade Union</span> is <span className="text-green-400">neutral</span> toward all factions except Pirates</li>
          <li><span className="text-foreground font-medium">Pirates</span> are <span className="text-red-400">hostile</span> to all other factions</li>
          <li>All faction members must maintain friendly reputation or be <span className="text-amber-400">expelled</span></li>
        </ul>
      </div>

      {/* Port Types */}
      <div className="mb-10">
        <h2 id="ports" className="text-xl font-bold text-foreground mb-3">🏙️ Port Control</h2>
        <p className="text-foreground-secondary text-sm mb-4">
          Most ports can be captured by military or pirate factions. Some ports have special rules:
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-4">
          <div className="bg-surface border border-surface-border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-foreground mb-2">🕌 Caliphate Ports</h3>
            <p className="text-xs text-foreground-secondary mb-2">Contested by Trade Union guilds via tender system.</p>
            <p className="text-xs text-foreground-muted">Assab · Al-Khalif · Sharhat</p>
          </div>
          <div className="bg-surface border border-surface-border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-foreground mb-2">🏳️ Neutral Settlements</h3>
            <p className="text-xs text-foreground-secondary mb-2">Cannot be captured by any faction.</p>
            <p className="text-xs text-foreground-muted">Aldansk · Brandport · El Tigre · Freedom Bay · Nordberg · Puerto Salada · Santa Marta · Surako</p>
          </div>
          <div className="bg-surface border border-surface-border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-foreground mb-2">🏴‍☠️ Pirate Coves</h3>
            <p className="text-xs text-foreground-secondary mb-2">Can only be owned by Pirate faction members.</p>
            <p className="text-xs text-foreground-muted">Corsa-Nois Bay · Naabad Stronghold · Pirate City · Tortuga</p>
          </div>
        </div>
      </div>

      {/* The Empire */}
      <div className="mb-10">
        <h2 id="empire" className="text-xl font-bold text-foreground mb-3">👑 The Empire</h2>
        <p className="text-foreground-secondary text-sm mb-3">
          The Empire is a powerful NPC state seeking to reclaim the archipelago. It is technologically advanced, particularly in shipbuilding, comparable to Chinese maritime engineering. The exact location of the Empire&apos;s capital remains unknown, and its form of government is unclear — though it is believed to be a dynastic monarchy.
        </p>
        <p className="text-foreground-secondary text-sm mb-3">
          The Empire periodically launches fleet assaults on faction-held ports. During these events, each guild must defend their port by destroying all Imperial ships around their fort. Ports not controlled by any faction are under Empire control by default.
        </p>
        <div className="border-l-4 border-amber-500 bg-amber-500/10 rounded-r-lg px-4 py-3">
          <p className="text-sm text-amber-300">
            Imperial ships (Huracan, etc.) are acquired through Legend Tokens and Escudo — see the ship database for details.
          </p>
        </div>
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
