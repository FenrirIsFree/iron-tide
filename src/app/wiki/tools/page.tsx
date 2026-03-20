import Link from 'next/link'
import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import SeeAlso from '@/components/wiki/SeeAlso'
import NavBox from '@/components/wiki/NavBox'

export const metadata = {
  title: 'Interactive Tools — The Iron Tide Wiki',
  description: 'Interactive calculators and tools for World of Sea Battle — damage calculator, ship comparison, crafting costs, and XP planning.',
}

const TOOLS = [
  {
    href: '/wiki/tools/damage-calculator',
    icon: '💥',
    title: 'Damage Calculator',
    description: 'Calculate exact damage output. Pick your weapon, ammo type, target armor, and angle — uses real game formulas from decompiled source code.',
    tags: ['Combat', 'Weapons', 'Armor'],
  },
  {
    href: '/wiki/tools/ship-compare',
    icon: '🚢',
    title: 'Ship Comparison',
    description: 'Compare 2–3 ships side-by-side. Visual stat bars, green/red highlighting for winner of each category, links to ship detail pages.',
    tags: ['Ships', 'Stats'],
  },
  {
    href: '/wiki/tools/crafting-calculator',
    icon: '🔨',
    title: 'Crafting Calculator',
    description: 'Find total resource requirements for any ship or weapon. See estimated gold value and track what you still need to gather.',
    tags: ['Crafting', 'Resources', 'Economy'],
  },
  {
    href: '/wiki/tools/xp-calculator',
    icon: '⭐',
    title: 'XP Calculator',
    description: 'Plan your ship progression. Select class, current rate, and target rate to see total XP required with class modifiers applied.',
    tags: ['Ships', 'Progression', 'XP'],
  },
]

export default function ToolsPage() {
  return (
    <main className="flex-1 pt-8 pb-12 px-4 max-w-5xl mx-auto w-full">
      <WikiBreadcrumb current="Tools" />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">🛠️ Interactive Tools</h1>
        <p className="text-foreground-secondary mt-1">
          Calculators and planners using real game data and formulas
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {TOOLS.map(tool => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group flex flex-col gap-3 bg-surface border border-surface-border rounded-xl p-5 hover:border-accent hover:bg-surface-hover transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{tool.icon}</span>
              <div>
                <h2 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                  {tool.title}
                </h2>
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {tool.tags.map(tag => (
                    <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-accent/10 text-accent">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-foreground-secondary leading-relaxed">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>

      <SeeAlso items={[
        { title: '⚔️ Combat Guide', href: '/wiki/combat', description: 'Understand the damage formula and armor angles' },
        { title: '🔫 Weapons', href: '/wiki/weapons', description: 'All 42 weapons with stats' },
        { title: '💣 Ammo Types', href: '/wiki/ammo', description: 'Damage modifiers for each ammo type' },
        { title: '🚢 Ship Database', href: '/wiki/ships', description: 'All ships with full stats' },
        { title: '🔨 Crafting', href: '/wiki/crafting', description: 'Workshop recipes and crafting guide' },
      ]} />
      <NavBox
        category="Tools"
        icon="🛠️"
        items={[
          { label: 'Tools Hub', href: '/wiki/tools' },
          { label: 'Damage Calculator', href: '/wiki/tools/damage-calculator' },
          { label: 'Ship Comparison', href: '/wiki/tools/ship-compare' },
          { label: 'Crafting Calculator', href: '/wiki/tools/crafting-calculator' },
          { label: 'XP Calculator', href: '/wiki/tools/xp-calculator' },
        ]}
      />
    </main>
  )
}
