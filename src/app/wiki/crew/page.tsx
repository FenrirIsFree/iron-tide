import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import CrewContent from './CrewContent'
import { getCrewData } from '@/lib/gameData'

export const metadata = {
  title: 'Crew & Units — The Iron Tide Wiki',
  description: 'All crew types in World of Sea Battle — sailors, boarding units, and special crew with abilities.',
}

export default function CrewPage() {
  const crew = getCrewData()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4 max-w-5xl mx-auto w-full">
        <WikiBreadcrumb current="Crew & Units" />
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">👥 Crew & Units</h1>
          <p className="text-foreground-secondary mt-1">
            {(crew as unknown[]).length} crew types — sailors, fighters, and specialists
          </p>
        </div>
        <CrewContent crew={crew as any} />
      </main>
      <Footer />
    </div>
  )
}
