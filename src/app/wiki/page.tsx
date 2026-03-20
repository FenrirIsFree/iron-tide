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
        desc: 'Rank progression from 29 to 1 — XP requirements and what unlocks at each level.',
        href: '/wiki/ranks',
        count: '29 ranks',
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
        title: '⚙️ Game Mechanics',
        desc: 'Speed, combat, boarding, crew, repairs, weather, and economy systems.',
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
