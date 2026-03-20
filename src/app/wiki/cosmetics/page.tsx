import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import CosmeticsContent from './CosmeticsContent'
import { getCosmetics } from '@/lib/gameData'
import SeeAlso from '@/components/wiki/SeeAlso'
import NavBox from '@/components/wiki/NavBox'

export const metadata = {
  title: 'Ship Cosmetics — The Iron Tide Wiki',
  description: 'All ship customization in World of Sea Battle — flags, sails, figureheads, decals, and full ship designs.',
}

export default function CosmeticsPage() {
  const cosmetics = getCosmetics()

  return (
    <main className="flex-1 pt-8 pb-12 px-4 max-w-5xl mx-auto w-full">
      <WikiBreadcrumb current="Cosmetics" />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">🎨 Ship Cosmetics</h1>
        <p className="text-foreground-secondary mt-1">
          {cosmetics.length} customization items — flags, sails, figureheads, decals, and full ship designs
        </p>
      </div>
      <CosmeticsContent cosmetics={cosmetics} />
      <SeeAlso items={[
        { title: '🚢 Ships', href: '/wiki/ships', description: 'Ships that can be customized with cosmetics' },
        { title: '🏆 Achievements', href: '/wiki/achievements', description: 'Cosmetics unlocked via achievements' },
        { title: '🏟️ Arena', href: '/wiki/arena', description: 'Exclusive arena cosmetic rewards' },
        { title: '⚜️ Guilds', href: '/wiki/guilds', description: 'Guild cosmetics and faction insignia' },
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
