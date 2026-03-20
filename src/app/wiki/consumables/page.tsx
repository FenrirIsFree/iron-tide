import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import ConsumablesContent from './ConsumablesContent'
import { getConsumablesFull } from '@/lib/gameData'

export const metadata = {
  title: 'Consumables — The Iron Tide Wiki',
  description: 'All consumables in World of Sea Battle — repair kits, speed boosts, combat buffs, and squadron items.',
}

export default function ConsumablesPage() {
  const consumables = getConsumablesFull()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4 max-w-5xl mx-auto w-full">
        <WikiBreadcrumb current="Consumables" />
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">🧪 Consumables</h1>
          <p className="text-foreground-secondary mt-1">
            {consumables.length} items — repair kits, speed boosts, combat buffs, and squadron support
          </p>
        </div>
        <ConsumablesContent consumables={consumables} />
      </main>
      <Footer />
    </div>
  )
}
