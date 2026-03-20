import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import ArenaContent from './ArenaContent'
import { getArena } from '@/lib/gameData'
import NavBox from '@/components/wiki/NavBox'
import SeeAlso from '@/components/wiki/SeeAlso'

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
      <SeeAlso items={[
        { title: '⚜️ Guilds', href: '/wiki/guilds', description: 'Compete with your guild in arena seasons' },
        { title: '🏆 Achievements', href: '/wiki/achievements', description: 'Arena-specific achievement challenges' },
        { title: '🎨 Cosmetics', href: '/wiki/cosmetics', description: 'Exclusive cosmetics from arena rewards' },
        { title: '🚢 Ships', href: '/wiki/ships', description: 'Ships used in arena battles' },
        { title: '⚙️ Raw Mechanics', href: '/wiki/mechanics', description: 'Arena upgrade and scoring mechanics' },
      ]} />
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
