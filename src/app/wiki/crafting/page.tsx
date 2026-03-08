import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import CraftingContent from './CraftingContent'
import fs from 'fs'
import path from 'path'

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
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4 max-w-7xl mx-auto w-full">
        <WikiBreadcrumb current="Crafting" />
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">🔨 Crafting & Workshop</h1>
          <p className="text-foreground-secondary mt-1">
            Recipes, workshop blueprints, furnace smelting, and factory production
          </p>
        </div>
        <CraftingContent crafting={crafting} workshop={workshop} />
      </main>
      <Footer />
    </div>
  )
}
