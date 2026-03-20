import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const sections = [
  {
    heading: '⚓ Ships & Combat',
    items: [
      {
        title: '🚢 Ships',
        desc: 'Browse all ships — stats, classes, factions, weapon slots, and crafting costs.',
        href: '/wiki/ships',
        count: '62 ships',
      },
      {
        title: '🔫 Weapons',
        desc: 'Cannons, mortars, and special weapons — damage, range, reload, and crafting info.',
        href: '/wiki/weapons',
        count: '42 weapons',
      },
      {
        title: '💣 Ammunition',
        desc: 'All ammo types — hull damage, sail damage, crew damage, and special effects.',
        href: '/wiki/ammo',
        count: '13 types',
      },
      {
        title: '👥 Crew & Units',
        desc: 'Sailors, boarding units, and special crew — stats, abilities, and faction availability.',
        href: '/wiki/crew',
        count: '55 crew',
      },
      {
        title: '🛠️ Ship Upgrades',
        desc: 'Combat, speed, protection, and utility upgrades — effects, costs, and ranked values.',
        href: '/wiki/upgrades',
        count: '40 upgrades',
      },
    ],
  },
  {
    heading: '🗺️ Progression & Economy',
    items: [
      {
        title: '⭐ Ranks',
        desc: 'Rank progression from 1 to 30 — XP requirements and Legend skill unlock.',
        href: '/wiki/ranks',
        count: '30 ranks',
      },
      {
        title: '🧭 Captain Skills',
        desc: 'Craft, Exploration, Battle, and Legend skill trees — costs, effects, and requirements.',
        href: '/wiki/skills',
        count: '55 skills',
      },
      {
        title: '🔨 Crafting',
        desc: 'Recipes, workshop blueprints, furnace smelting, and factory production.',
        href: '/wiki/crafting',
        count: '47+ recipes',
      },
      {
        title: '🎁 Chests & Loot',
        desc: 'Complete loot tables for every chest — drop rates, ship chances, and reward breakdowns.',
        href: '/wiki/chests',
        count: '4 chest types',
      },
      {
        title: '🧪 Consumables',
        desc: 'Repair kits, speed boosts, combat buffs, and squadron support items.',
        href: '/wiki/consumables',
        count: '33 items',
      },
    ],
  },
  {
    heading: '🌍 World & Economy',
    items: [
      {
        title: '⚓ Ports',
        desc: 'Cities, bays, and pirate havens — ship building, resources, and port features.',
        href: '/wiki/ports',
        count: '42 ports',
      },
      {
        title: '💰 Trading',
        desc: 'Trade goods, price ranges, margins, tax rates, and profit efficiency rankings.',
        href: '/wiki/trading',
        count: '20 goods',
      },
      {
        title: '💎 Resources',
        desc: 'All materials, trade goods, currencies, and special items — values and weights.',
        href: '/wiki/resources',
        count: '68 resources',
      },
    ],
  },
  {
    heading: '📖 Game Systems',
    items: [
      {
        title: '💀 NPCs & Bosses',
        desc: 'Enemy types, named bosses, loot tables, and capture mechanics.',
        href: '/wiki/npcs',
        count: '14 bosses',
      },
      {
        title: '🏆 Achievements',
        desc: 'Battle, Arena, Top, and Other — earn marks and prove your skill.',
        href: '/wiki/achievements',
        count: '57 achievements',
      },
      {
        title: '⚔️ PvE Missions',
        desc: 'Battle NPC waves — wave compositions, rewards, ship requirements.',
        href: '/wiki/missions',
        count: '12 missions',
      },
      {
        title: '🎨 Cosmetics',
        desc: 'Ship customization — flags, sails, figureheads, decals, and full ship designs.',
        href: '/wiki/cosmetics',
        count: '562 items',
      },
      {
        title: '🏟️ Arena',
        desc: 'PvP arena mode — random upgrades, ranked seasons, and exclusive rewards.',
        href: '/wiki/arena',
        count: '16 maps',
      },
      {
        title: '⚜️ Guilds',
        desc: 'Guild system — creation, economy, alliances, faction competition, and titles.',
        href: '/wiki/guilds',
        count: '13 systems',
      },
      {
        title: '⚔️ Combat Guide',
        desc: 'Damage formulas, armor angles, cannons, mortars, boarding, ramming, weather — from decompiled code and real PvP data.',
        href: '/wiki/combat',
        count: '11 sections',
      },
      {
        title: '⚙️ Raw Mechanics',
        desc: 'Technical reference — all game systems data in browsable format.',
        href: '/wiki/mechanics',
        count: '18 systems',
      },
    ],
  },
]

export const metadata = {
  title: 'Wiki — The Iron Tide',
  description: 'World of Sea Battle game wiki — ships, weapons, ammo, crew, skills, ranks, crafting, and game mechanics. Sourced from decompiled game data.',
}

export default function WikiPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4 max-w-5xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">📖 Game Wiki</h1>
          <p className="text-foreground-secondary mt-2">
            Comprehensive World of Sea Battle reference — sourced from decompiled game data and network analysis.
          </p>
        </div>

        <div className="space-y-10">
          {sections.map((section) => (
            <div key={section.heading}>
              <h2 className="text-lg font-semibold text-foreground mb-4">{section.heading}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {section.items.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="block bg-surface border border-surface-border rounded-xl p-5 hover:border-accent hover:bg-surface-hover transition-colors group"
                  >
                    <h3 className="text-base font-semibold text-foreground mb-1.5 group-hover:text-accent transition-colors">
                      {s.title}
                    </h3>
                    <p className="text-foreground-secondary text-sm mb-3 leading-relaxed">{s.desc}</p>
                    <span className="text-accent text-xs font-medium">{s.count}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
