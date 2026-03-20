import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import SkillsContent from './SkillsContent'
import { getSkills } from '@/lib/gameData'

export const metadata = {
  title: 'Captain Skills — The Iron Tide Wiki',
  description: 'All 55 captain skills in World of Sea Battle — Craft, Exploration, Battle, and Legend skill trees.',
}

export default function SkillsPage() {
  const skills = getSkills()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4 max-w-5xl mx-auto w-full">
        <WikiBreadcrumb current="Captain Skills" />
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">🧭 Captain Skills</h1>
          <p className="text-foreground-secondary mt-1">
            {skills.length} skills across 4 trees — invest skill points and gold to unlock powerful abilities
          </p>
        </div>
        <SkillsContent skills={skills} />
      </main>
      <Footer />
    </div>
  )
}
