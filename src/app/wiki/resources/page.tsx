import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import ResourcesContent from './ResourcesContent'
import { getResources } from '@/lib/gameData'
import SeeAlso from '@/components/wiki/SeeAlso'
import NavBox from '@/components/wiki/NavBox'

export const metadata = {
  title: 'Resources — The Iron Tide Wiki',
  description: 'All resources in World of Sea Battle — materials, trade goods, currencies, and special items.',
}

export default function ResourcesPage() {
  const resources = getResources()

  return (
    <main className="flex-1 pt-8 pb-12 px-4 max-w-5xl mx-auto w-full">
      <WikiBreadcrumb current="Resources" />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">💎 Resources</h1>
        <p className="text-foreground-secondary mt-1">
          {resources.length} resources — materials, trade goods, currencies, and special items
        </p>
      </div>
      <ResourcesContent resources={resources} />
      <SeeAlso items={[
        { title: '🔨 Crafting', href: '/wiki/crafting', description: 'Use resources in crafting recipes' },
        { title: '💰 Trading', href: '/wiki/trading', description: 'Trade resources between ports for profit' },
        { title: '⚓ Ports', href: '/wiki/ports', description: 'Ports that produce or sell resources' },
        { title: '🎁 Chests & Loot', href: '/wiki/chests', description: 'Resources obtainable from chests' },
        { title: '🛠️ Ship Upgrades', href: '/wiki/upgrades', description: 'Upgrade crafting material costs' },
      ]} />
      <NavBox
        category="World & Economy"
        icon="🌍"
        items={[
          { label: 'Ports', href: '/wiki/ports' },
          { label: 'Trading', href: '/wiki/trading' },
          { label: 'Resources', href: '/wiki/resources' },
        ]}
      />
    </main>
  )
}
