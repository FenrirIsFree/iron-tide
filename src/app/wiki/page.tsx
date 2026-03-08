import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const sections = [
  {
    title: '🚢 Ships',
    desc: 'Browse all 69 ships — stats, classes, factions, and descriptions.',
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
    title: '💀 NPCs & Bosses',
    desc: 'Enemy types, named bosses, loot tables, and capture mechanics.',
    href: '/wiki/npcs',
    count: '14 bosses',
  },
  {
    title: '🎁 Chests & Loot',
    desc: 'Complete loot tables for every chest — drop rates, ship chances, and reward breakdowns.',
    href: '/wiki/chests',
    count: '4 chest types',
  },
  {
    title: '🔨 Crafting',
    desc: 'Recipes, workshop blueprints, furnace smelting, and factory production.',
    href: '/wiki/crafting',
    count: '47+ recipes',
  },
  {
    title: '⚙️ Game Mechanics',
    desc: 'Speed, combat, boarding, crew, repairs, weather, and economy systems.',
    href: '/wiki/mechanics',
    count: '18 systems',
  },
]

export const metadata = {
  title: 'Wiki — The Iron Tide',
  description: 'World of Sea Battle game wiki — ships, weapons, NPCs, crafting, and mechanics.',
}

export default function WikiPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4 max-w-5xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">📖 Game Wiki</h1>
          <p className="text-foreground-secondary mt-2">
            Comprehensive World of Sea Battle reference — sourced from decompiled game data.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="block bg-surface border border-surface-border rounded-xl p-6 hover:border-accent hover:bg-surface-hover transition-colors"
            >
              <h2 className="text-lg font-semibold text-foreground mb-2">{s.title}</h2>
              <p className="text-foreground-secondary text-sm mb-3">{s.desc}</p>
              <span className="text-accent text-xs font-medium">{s.count}</span>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
