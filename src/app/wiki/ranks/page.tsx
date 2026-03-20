import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import RanksContent from './RanksContent'
import { getRanks, getShips, getSkills } from '@/lib/gameData'

export const metadata = {
  title: 'Ranks — The Iron Tide Wiki',
  description: 'Rank progression in World of Sea Battle — XP requirements, ship unlocks, and skill requirements.',
}

export default function RanksPage() {
  const ranks = getRanks()
  const ships = getShips()
  const skills = getSkills()

  // Compute what unlocks at each rank
  const shipsByRank: Record<number, string[]> = {}
  for (const s of ships) {
    const r = s.requiredRank
    if (r > 0) {
      if (!shipsByRank[r]) shipsByRank[r] = []
      shipsByRank[r].push(s.name)
    }
  }

  const skillsByRank: Record<number, string[]> = {}
  for (const s of skills) {
    const r = parseInt(s.requiredRank)
    if (r > 0) {
      if (!skillsByRank[r]) skillsByRank[r] = []
      skillsByRank[r].push(s.name)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4 max-w-5xl mx-auto w-full">
        <WikiBreadcrumb current="Ranks" />
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">⭐ Rank Progression</h1>
          <p className="text-foreground-secondary mt-1">
            {ranks.length} ranks — earn XP to unlock ships, skills, and content
          </p>
        </div>
        <RanksContent
          ranks={ranks as any}
          shipsByRank={shipsByRank}
          skillsByRank={skillsByRank}
        />
      </main>
      <Footer />
    </div>
  )
}
