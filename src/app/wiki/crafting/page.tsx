import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import CraftingContent from './CraftingContent'
import fs from 'fs'
import path from 'path'
import SeeAlso from '@/components/wiki/SeeAlso'
import NavBox from '@/components/wiki/NavBox'

export const metadata = {
  title: 'Crafting — The Iron Tide Wiki',
  description: 'Crafting recipes, workshop blueprints, and factory production in World of Sea Battle.',
}

function loadCraftingData() {
  const dir = path.join(process.cwd(), 'game-data')
  const crafting = JSON.parse(fs.readFileSync(path.join(dir, 'crafting-recipes.json'), 'utf-8'))
  const workshop = JSON.parse(fs.readFileSync(path.join(dir, 'wiki-workshop-recipes.json'), 'utf-8'))
  return { crafting, workshop }
}

export default function CraftingPage() {
  const { crafting, workshop } = loadCraftingData()

  return (
    <main className="flex-1 pt-8 pb-12 px-4 max-w-7xl mx-auto w-full">
      <WikiBreadcrumb current="Crafting" />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">🔨 Crafting & Workshop</h1>
        <p className="text-foreground-secondary mt-1">
          Recipes, workshop blueprints, furnace smelting, and factory production
        </p>
      </div>
      <CraftingContent crafting={crafting} workshop={workshop} />
      <SeeAlso items={[
        { title: '💎 Resources', href: '/wiki/resources', description: 'Raw materials needed for crafting recipes' },
        { title: '🚢 Ships', href: '/wiki/ships', description: 'Ships craftable at the workshop' },
        { title: '🛠️ Ship Upgrades', href: '/wiki/upgrades', description: 'Upgrades crafted from resources' },
        { title: '🎁 Chests & Loot', href: '/wiki/chests', description: 'Get crafting materials from chests' },
        { title: '⚓ Ports', href: '/wiki/ports', description: 'Ports with workshop and factory buildings' },
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
