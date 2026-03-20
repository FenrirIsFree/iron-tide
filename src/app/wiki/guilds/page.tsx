import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import GuildsContent from './GuildsContent'
import { getGuildData } from '@/lib/gameData'
import NavBox from '@/components/wiki/NavBox'
import SeeAlso from '@/components/wiki/SeeAlso'

export const metadata = {
  title: 'Guilds — The Iron Tide Wiki',
  description: 'Guild system in World of Sea Battle — creation, ranks, alliances, economy, and faction competition.',
}

export default function GuildsPage() {
  const guildData = getGuildData()

  return (
    <main className="flex-1 pt-8 pb-12 px-4 max-w-5xl mx-auto w-full">
      <WikiBreadcrumb current="Guilds" />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">⚜️ Guilds</h1>
        <p className="text-foreground-secondary mt-1">
          Create or join a guild — compete for faction titles, share resources, and conquer ports
        </p>
      </div>
      <GuildsContent data={guildData} />
      <SeeAlso items={[
        { title: '🏟️ Arena', href: '/wiki/arena', description: 'Compete as a guild in ranked arena seasons' },
        { title: '⚓ Ports', href: '/wiki/ports', description: 'Conquer ports to expand guild territory' },
        { title: '🏆 Achievements', href: '/wiki/achievements', description: 'Guild-based achievement challenges' },
        { title: '💰 Trading', href: '/wiki/trading', description: 'Guild economy and shared trade resources' },
        { title: '⭐ Ranks', href: '/wiki/ranks', description: 'Rank requirements for guild leadership' },
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
