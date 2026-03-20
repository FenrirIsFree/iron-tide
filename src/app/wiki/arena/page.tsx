import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import ArenaContent from './ArenaContent'
import { getArena } from '@/lib/gameData'

export const metadata = {
  title: 'Arena — The Iron Tide Wiki',
  description: 'Arena mode in World of Sea Battle — maps, upgrades, ranked rewards, and how the arena works.',
}

export default function ArenaPage() {
  const arena = getArena()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4 max-w-5xl mx-auto w-full">
        <WikiBreadcrumb current="Arena" />
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">🏟️ Arena</h1>
          <p className="text-foreground-secondary mt-1">
            PvP arena mode — random upgrades, ranked seasons, and exclusive rewards
          </p>
        </div>
        <ArenaContent arena={arena} />
      </main>
      <Footer />
    </div>
  )
}
