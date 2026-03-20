import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import AchievementsContent from './AchievementsContent'
import { getAchievements } from '@/lib/gameData'

export const metadata = {
  title: 'Achievements — The Iron Tide Wiki',
  description: 'All achievements in World of Sea Battle — Battle, Arena, Top, and Other categories with rewards.',
}

export default function AchievementsPage() {
  const achievements = getAchievements()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4 max-w-5xl mx-auto w-full">
        <WikiBreadcrumb current="Achievements" />
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">🏆 Achievements</h1>
          <p className="text-foreground-secondary mt-1">
            {achievements.length} achievements — earn marks and unlock ships by completing challenges
          </p>
        </div>
        <AchievementsContent achievements={achievements} />
      </main>
      <Footer />
    </div>
  )
}
