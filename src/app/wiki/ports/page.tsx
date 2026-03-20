import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import PortsContent from './PortsContent'
import { getPorts } from '@/lib/gameData'

export const metadata = {
  title: 'Ports — The Iron Tide Wiki',
  description: 'All ports in World of Sea Battle — types, ship building ranks, resources, and bonuses.',
}

export default function PortsPage() {
  const ports = getPorts()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4 max-w-5xl mx-auto w-full">
        <WikiBreadcrumb current="Ports" />
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">⚓ Ports</h1>
          <p className="text-foreground-secondary mt-1">
            {ports.length} ports — cities, bays, and pirate havens across the Archipelago
          </p>
        </div>
        <PortsContent ports={ports} />
      </main>
      <Footer />
    </div>
  )
}
