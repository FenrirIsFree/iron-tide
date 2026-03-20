import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import ArenaContent from './ArenaContent'
import { getArena } from '@/lib/gameData'
import NavBox from '@/components/wiki/NavBox'

export const metadata = {
  title: 'Arena — The Iron Tide Wiki',
  description: 'Arena mode in World of Sea Battle — maps, upgrades, ranked rewards, and how the arena works.',
}

export default function ArenaPage() {
  const arena = getArena()

  return (
    <main className="flex-1 pt-8 pb-12 px-4 max-w-5xl mx-auto w-full">
      <WikiBreadcrumb current="Arena" />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">🏟️ Arena</h1>
        <p className="text-foreground-secondary mt-1">
          PvP arena mode — random upgrades, ranked seasons, and exclusive rewards
        </p>
      </div>
      <ArenaContent arena={arena} />
      <NavBox
        category="Competitive"
        icon="🏟️"
        items={[
          { label: 'Arena', href: '/wiki/arena' },
          { label: 'Guilds', href: '/wiki/guilds' },
          { label: 'Achievements', href: '/wiki/achievements' },
          { label: 'Cosmetics', href: '/wiki/cosmetics' },
        ]}
      />
    </main>
  )
}
