import { getShips } from '@/lib/gameData'
import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import ShipTable from './ShipTable'
import SeeAlso from '@/components/wiki/SeeAlso'
import NavBox from '@/components/wiki/NavBox'

export const metadata = {
  title: 'Ships — The Iron Tide Wiki',
  description: 'All 62 ships in World of Sea Battle — stats, classes, factions, and class tree progression.',
}

const SHIP_CLASSES = [
  { name: 'Battle', gameType: 'Battleship', icon: '⚔️', desc: 'Ranged and mobile combat. Require maximum focus but can win almost any fight in skilled hands.' },
  { name: 'Heavy', gameType: 'Hardship', icon: '🛡️', desc: 'Withstand heavy enemy fire. High firepower and durability at the cost of speed.' },
  { name: 'Transport', gameType: 'CargoShip', icon: '📦', desc: 'Best cargo capacity. Combat usage is secondary.' },
  { name: 'Fast', gameType: 'Destroyer', icon: '💨', desc: 'Fast-moving interceptors. Lightly armed but nimble.' },
  { name: 'Siege', gameType: 'Mortar', icon: '💣', desc: 'Powerful mortar weapons. Nimble but fragile — a threat to forts and stationary ships.' },
]

const RESEARCH_XP = [
  { rate: 'VII', xp: 0, label: 'Starter' },
  { rate: 'VI', xp: 800, label: '' },
  { rate: 'V', xp: 4500, label: '' },
  { rate: 'IV', xp: 14000, label: '' },
  { rate: 'III', xp: 25000, label: '' },
  { rate: 'II', xp: 50000, label: '' },
  { rate: 'I', xp: 70000, label: 'Highest' },
]

export default function ShipsPage() {
  const ships = getShips()

  // Group ships by class
  const classCounts: Record<string, number> = {}
  for (const s of ships) {
    classCounts[s.gameType] = (classCounts[s.gameType] || 0) + 1
  }

  return (
    <main className="flex-1 pt-8 pb-12 px-4 max-w-7xl mx-auto w-full">
      <WikiBreadcrumb current="Ships" />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">🚢 Ship Database</h1>
        <p className="text-foreground-secondary mt-1">
          {ships.length} ships across 5 class trees — click any row to expand details
        </p>
      </div>

      {/* Class Tree Overview */}
      <div className="mb-8 bg-surface border border-surface-border rounded-xl p-5 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">📐 Ship Class Trees</h2>
        <p className="text-sm text-foreground-secondary">
          Ships are unlocked by researching their <strong>class tree</strong>. Play a ship of a given class to earn XP toward that class.
          Installing all upgrades boosts XP gain to 100%. More branches researched = bonus XP to other branches.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {SHIP_CLASSES.map(cls => (
            <div key={cls.gameType} className="bg-surface-hover/50 border border-surface-border rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{cls.icon}</span>
                <span className="font-semibold text-foreground text-sm">{cls.name}</span>
                <span className="text-xs text-foreground-muted ml-auto">{classCounts[cls.gameType] || 0} ships</span>
              </div>
              <p className="text-xs text-foreground-muted leading-relaxed">{cls.desc}</p>
            </div>
          ))}
        </div>

        {/* Research XP Table */}
        <div>
          <h3 className="text-sm font-semibold text-foreground-secondary mb-2">Research XP by Rate</h3>
          <div className="flex flex-wrap gap-2">
            {RESEARCH_XP.map(r => (
              <div key={r.rate} className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md bg-surface border border-surface-border">
                <span className="text-accent font-bold">Rate {r.rate}</span>
                <span className="text-foreground-muted">→</span>
                <span className="text-foreground font-mono">{r.xp === 0 ? 'Free' : `${r.xp.toLocaleString()} XP`}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-foreground-muted mt-2">
            Destroyers get a 20% XP discount. Heavy ships cost 20% more XP.
          </p>
        </div>
      </div>

      <ShipTable ships={ships as any} />
      <SeeAlso items={[
        { title: '⚔️ Combat Guide', href: '/wiki/combat', description: 'Master the damage formula and armor angles' },
        { title: '🔫 Weapons', href: '/wiki/weapons', description: 'Find the right cannons for your ship' },
        { title: '🛠️ Ship Upgrades', href: '/wiki/upgrades', description: 'Equip upgrades to boost ship performance' },
        { title: '👥 Crew & Units', href: '/wiki/crew', description: 'Man your ship with the best crew' },
        { title: '🔨 Crafting', href: '/wiki/crafting', description: 'Build ships and weapons from resources' },
        { title: '🎁 Chests & Loot', href: '/wiki/chests', description: 'Win ships from loot chests' },
      ]} />
      <NavBox
        category="Ships"
        icon="🚢"
        items={[
          { label: 'Ship Database', href: '/wiki/ships' },
          { label: 'Ship Class Trees', href: '/wiki/ships/classes' },
          { label: 'Crafting', href: '/wiki/crafting' },
        ]}
      />
    </main>
  )
}
