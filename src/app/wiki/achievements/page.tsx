import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import AchievementsContent from './AchievementsContent'
import { getAchievements } from '@/lib/gameData'
import SeeAlso from '@/components/wiki/SeeAlso'
import NavBox from '@/components/wiki/NavBox'

export const metadata = {
  title: 'Achievements — The Iron Tide Wiki',
  description: 'All achievements in World of Sea Battle — Battle, Arena, Top, and Other categories with rewards.',
}

export default function AchievementsPage() {
  const achievements = getAchievements()

  return (
    <main className="flex-1 pt-8 pb-12 px-4 max-w-5xl mx-auto w-full">
      <WikiBreadcrumb current="Achievements" />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">🏆 Achievements</h1>
        <p className="text-foreground-secondary mt-1">
          {achievements.length} achievements — earn marks and unlock ships by completing challenges
        </p>
      </div>
      <AchievementsContent achievements={achievements} />
      <SeeAlso items={[
        { title: '🏟️ Arena', href: '/wiki/arena', description: 'PvP mode with exclusive achievement marks' },
        { title: '⚔️ PvE Missions', href: '/wiki/missions', description: 'Complete missions to earn marks' },
        { title: '🎨 Cosmetics', href: '/wiki/cosmetics', description: 'Cosmetics unlocked via achievements' },
        { title: '⚜️ Guilds', href: '/wiki/guilds', description: 'Guild achievements and faction titles' },
        { title: '🚢 Ships', href: '/wiki/ships', description: 'Ships awarded as achievement prizes' },
      ]} />
      <NavBox
        category="Game Systems"
        icon="📖"
        items={[
          { label: 'NPCs & Bosses', href: '/wiki/npcs' },
          { label: 'Achievements', href: '/wiki/achievements' },
          { label: 'PvE Missions', href: '/wiki/missions' },
          { label: 'Cosmetics', href: '/wiki/cosmetics' },
          { label: 'Arena', href: '/wiki/arena' },
          { label: 'Guilds', href: '/wiki/guilds' },
          { label: 'Raw Mechanics', href: '/wiki/mechanics' },
        ]}
      />
    </main>
  )
}
