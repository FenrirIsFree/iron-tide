import { getShips } from '@/lib/gameData'
import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import SeeAlso from '@/components/wiki/SeeAlso'
import NavBox from '@/components/wiki/NavBox'
import ShipCompareClient from './ShipCompareClient'

export const metadata = {
  title: 'Ship Comparison — The Iron Tide Wiki',
  description: 'Compare ships side-by-side in World of Sea Battle. Visual stat bars, green/red highlighting, and links to ship detail pages.',
}

export default function ShipComparePage() {
  const ships = getShips()

  return (
    <main className="flex-1 pt-8 pb-12 px-4 max-w-5xl mx-auto w-full">
      <WikiBreadcrumb current="Ship Comparison" parent={{ label: 'Tools', href: '/wiki/tools' }} />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">🚢 Ship Comparison</h1>
        <p className="text-foreground-secondary mt-1">
          Compare up to 3 ships side-by-side — visual stat bars with winner highlighting
        </p>
      </div>

      <ShipCompareClient ships={ships} />

      <SeeAlso items={[
        { title: '🚢 Ship Database', href: '/wiki/ships', description: 'Full list of all ships' },
        { title: '💥 Damage Calculator', href: '/wiki/tools/damage-calculator', description: 'Calculate damage against ship armor values' },
        { title: '🔨 Crafting Calculator', href: '/wiki/tools/crafting-calculator', description: 'Find crafting costs for each ship' },
        { title: '⭐ XP Calculator', href: '/wiki/tools/xp-calculator', description: 'Plan your ship progression' },
        { title: '⚔️ Combat Guide', href: '/wiki/combat', description: 'Learn how ship stats affect combat' },
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
