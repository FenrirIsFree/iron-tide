import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import GuildsContent from './GuildsContent'
import { getGuildData } from '@/lib/gameData'

export const metadata = {
  title: 'Guilds — The Iron Tide Wiki',
  description: 'Guild system in World of Sea Battle — creation, ranks, alliances, economy, and faction competition.',
}

export default function GuildsPage() {
  const guildData = getGuildData()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4 max-w-5xl mx-auto w-full">
        <WikiBreadcrumb current="Guilds" />
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">⚜️ Guilds</h1>
          <p className="text-foreground-secondary mt-1">
            Create or join a guild — compete for faction titles, share resources, and conquer ports
          </p>
        </div>
        <GuildsContent data={guildData} />
      </main>
      <Footer />
    </div>
  )
}
