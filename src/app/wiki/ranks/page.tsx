import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import RanksContent from './RanksContent'
import { getRanks } from '@/lib/gameData'
import NavBox from '@/components/wiki/NavBox'

export const metadata = {
  title: 'Ranks — The Iron Tide Wiki',
  description: 'Rank progression in World of Sea Battle — XP requirements from rank 1 to rank 30, where Legend skills unlock.',
}

export default function RanksPage() {
  const ranks = getRanks()

  return (
    <main className="flex-1 pt-8 pb-12 px-4 max-w-5xl mx-auto w-full">
      <WikiBreadcrumb current="Ranks" />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">⭐ Rank Progression</h1>
        <p className="text-foreground-secondary mt-1">
          {ranks.length} ranks — earn XP from rank 1 to rank 30 to unlock Legend skills
        </p>
      </div>
      <RanksContent ranks={ranks} />
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
