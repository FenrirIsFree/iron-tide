import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import CrewContent from './CrewContent'
import { getCrewData } from '@/lib/gameData'
import SeeAlso from '@/components/wiki/SeeAlso'
import NavBox from '@/components/wiki/NavBox'

export const metadata = {
  title: 'Crew & Units — The Iron Tide Wiki',
  description: 'All crew types in World of Sea Battle — sailors, boarding units, and special crew with abilities.',
}

export default function CrewPage() {
  const crew = getCrewData()

  return (
    <main className="flex-1 pt-8 pb-12 px-4 max-w-5xl mx-auto w-full">
      <WikiBreadcrumb current="Crew & Units" />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">👥 Crew & Units</h1>
        <p className="text-foreground-secondary mt-1">
          {(crew as unknown[]).length} crew types — sailors, fighters, and specialists
        </p>
      </div>
      <CrewContent crew={crew as any} />
      <SeeAlso items={[
        { title: '🧭 Captain Skills', href: '/wiki/skills', description: 'Skills that boost your crew\'s effectiveness' },
        { title: '⭐ Ranks', href: '/wiki/ranks', description: 'Rank up to unlock stronger crew options' },
        { title: '⚔️ Combat Guide', href: '/wiki/combat', description: 'How crew affects combat performance' },
        { title: '🚢 Ships', href: '/wiki/ships', description: 'Ship classes and their crew capacity' },
        { title: '🏟️ Arena', href: '/wiki/arena', description: 'Special crew available in arena mode' },
      ]} />
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
