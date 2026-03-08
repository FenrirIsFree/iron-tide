import { getShips } from '@/lib/gameData'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import ShipTable from './ShipTable'

export const metadata = {
  title: 'Ships — The Iron Tide Wiki',
  description: 'All 69 ships in World of Sea Battle — stats, classes, and descriptions.',
}

export default function ShipsPage() {
  const ships = getShips()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4 max-w-7xl mx-auto w-full">
        <WikiBreadcrumb current="Ships" />
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">🚢 Ship Database</h1>
          <p className="text-foreground-secondary mt-1">
            {ships.length} ships — click any row to expand details
          </p>
        </div>
        <ShipTable ships={ships} />
      </main>
      <Footer />
    </div>
  )
}
