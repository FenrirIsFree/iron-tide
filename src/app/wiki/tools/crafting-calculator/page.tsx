import { getShips, getWeapons, getResources } from '@/lib/gameData'
import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import SeeAlso from '@/components/wiki/SeeAlso'
import NavBox from '@/components/wiki/NavBox'
import CraftingCalculatorClient from './CraftingCalculatorClient'

export const metadata = {
  title: 'Crafting Calculator — The Iron Tide Wiki',
  description: 'Calculate total resource requirements for ships and weapons in World of Sea Battle. See estimated gold value and track what you still need.',
}

export default function CraftingCalculatorPage() {
  const ships = getShips()
  const weapons = getWeapons()
  const resources = getResources()

  return (
    <main className="flex-1 pt-8 pb-12 px-4 max-w-5xl mx-auto w-full">
      <WikiBreadcrumb current="Crafting Calculator" parent={{ label: 'Tools', href: '/wiki/tools' }} />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">🔨 Crafting Calculator</h1>
        <p className="text-foreground-secondary mt-1">
          Total resource requirements for any ship or weapon — with &quot;I have these&quot; tracking mode
        </p>
      </div>

      <CraftingCalculatorClient ships={ships} weapons={weapons} resources={resources} />

      <SeeAlso items={[
        { title: '🔨 Crafting Guide', href: '/wiki/crafting', description: 'Workshop recipes and crafting mechanics' },
        { title: '📦 Resources', href: '/wiki/resources', description: 'All resources and where to find them' },
        { title: '🚢 Ship Database', href: '/wiki/ships', description: 'Ship stats and acquisition methods' },
        { title: '🔫 Weapons', href: '/wiki/weapons', description: 'All weapons with crafting info' },
        { title: '🏙️ Ports', href: '/wiki/ports', description: 'Ports and their crafting bonuses' },
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
