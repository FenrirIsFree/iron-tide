import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import SeeAlso from '@/components/wiki/SeeAlso'
import NavBox from '@/components/wiki/NavBox'
import XpCalculatorClient from './XpCalculatorClient'

export const metadata = {
  title: 'XP Calculator — The Iron Tide Wiki',
  description: 'Calculate XP needed to progress through ship rates in World of Sea Battle. Select class and target rate to plan your progression.',
}

export default function XpCalculatorPage() {
  return (
    <main className="flex-1 pt-8 pb-12 px-4 max-w-5xl mx-auto w-full">
      <WikiBreadcrumb current="XP Calculator" parent={{ label: 'Tools', href: '/wiki/tools' }} />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">⭐ XP Calculator</h1>
        <p className="text-foreground-secondary mt-1">
          Plan your ship progression — select class, current rate, and target rate to see total XP required
        </p>
      </div>

      <XpCalculatorClient />

      <SeeAlso items={[
        { title: '🚢 Ship Database', href: '/wiki/ships', description: 'All ships with class and rate info' },
        { title: '🏆 Ranks & Progression', href: '/wiki/ranks', description: 'Player ranks and XP requirements' },
        { title: '🚢 Ship Comparison', href: '/wiki/tools/ship-compare', description: 'Compare stats between rate tiers' },
        { title: '🔨 Crafting Calculator', href: '/wiki/tools/crafting-calculator', description: 'Plan resources for your next ship' },
        { title: '🛠️ Ship Upgrades', href: '/wiki/upgrades', description: 'Upgrades that boost XP gain' },
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
