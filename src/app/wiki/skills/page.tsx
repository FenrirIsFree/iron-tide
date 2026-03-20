import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import SkillsContent from './SkillsContent'
import { getSkills } from '@/lib/gameData'
import NavBox from '@/components/wiki/NavBox'

export const metadata = {
  title: 'Captain Skills — The Iron Tide Wiki',
  description: 'All 55 captain skills in World of Sea Battle — Craft, Exploration, Battle, and Legend skill trees.',
}

export default function SkillsPage() {
  const skills = getSkills()

  return (
    <main className="flex-1 pt-8 pb-12 px-4 max-w-5xl mx-auto w-full">
      <WikiBreadcrumb current="Captain Skills" />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">🧭 Captain Skills</h1>
        <p className="text-foreground-secondary mt-1">
          {skills.length} skills across 4 trees — invest skill points and gold to unlock powerful abilities
        </p>
      </div>
      <SkillsContent skills={skills} />
      <NavBox
        category="Crew & Skills"
        icon="👥"
        items={[
          { label: 'Crew Types', href: '/wiki/crew' },
          { label: 'Captain Skills', href: '/wiki/skills' },
          { label: 'Ranks', href: '/wiki/ranks' },
        ]}
      />
    </main>
  )
}
