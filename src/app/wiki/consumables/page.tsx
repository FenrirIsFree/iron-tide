import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import ConsumablesContent from './ConsumablesContent'
import { getConsumablesFull } from '@/lib/gameData'
import SeeAlso from '@/components/wiki/SeeAlso'
import NavBox from '@/components/wiki/NavBox'

export const metadata = {
  title: 'Consumables — The Iron Tide Wiki',
  description: 'All consumables in World of Sea Battle — repair kits, speed boosts, combat buffs, and squadron items.',
}

export default function ConsumablesPage() {
  const consumables = getConsumablesFull()

  return (
    <main className="flex-1 pt-8 pb-12 px-4 max-w-5xl mx-auto w-full">
      <WikiBreadcrumb current="Consumables" />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">🧪 Consumables</h1>
        <p className="text-foreground-secondary mt-1">
          {consumables.length} items — repair kits, speed boosts, combat buffs, and squadron support
        </p>
      </div>
      <ConsumablesContent consumables={consumables} />
      <SeeAlso items={[
        { title: '🚢 Ships', href: '/wiki/ships', description: 'Equip consumables to your ship loadout' },
        { title: '⚔️ Combat Guide', href: '/wiki/combat', description: 'How consumables interact with combat' },
        { title: '🎁 Chests & Loot', href: '/wiki/chests', description: 'Obtain consumables from chests' },
        { title: '🔨 Crafting', href: '/wiki/crafting', description: 'Craft consumables at the workshop' },
        { title: '👥 Crew & Units', href: '/wiki/crew', description: 'Squadron consumables for crew' },
      ]} />
      <NavBox
        category="Progression"
        icon="🗺️"
        items={[
          { label: 'Ranks', href: '/wiki/ranks' },
          { label: 'Captain Skills', href: '/wiki/skills' },
          { label: 'Crafting', href: '/wiki/crafting' },
          { label: 'Chests & Loot', href: '/wiki/chests' },
          { label: 'Consumables', href: '/wiki/consumables' },
        ]}
      />
    </main>
  )
}
