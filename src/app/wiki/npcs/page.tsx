import { getNpcs } from '@/lib/gameData'
import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import NpcContent from './NpcContent'
import SeeAlso from '@/components/wiki/SeeAlso'
import NavBox from '@/components/wiki/NavBox'

export const metadata = {
  title: 'NPCs & Bosses — The Iron Tide Wiki',
  description: 'NPC types, named bosses, loot tables, and combat mechanics in World of Sea Battle.',
}

export default function NpcsPage() {
  const npcs = getNpcs()

  return (
    <main className="flex-1 pt-8 pb-12 px-4 max-w-7xl mx-auto w-full">
      <WikiBreadcrumb current="NPCs & Bosses" />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">💀 NPCs & Bosses</h1>
        <p className="text-foreground-secondary mt-1">
          {npcs.npcTypes.length} NPC types · {npcs.bosses.length} named bosses
        </p>
      </div>
      <NpcContent npcs={npcs as any} />
      <SeeAlso items={[
        { title: '⚔️ Combat Guide', href: '/wiki/combat', description: 'Combat strategies for fighting NPCs' },
        { title: '🚢 Ships', href: '/wiki/ships', description: 'Ships used by NPC fleets' },
        { title: '⚔️ PvE Missions', href: '/wiki/missions', description: 'Missions with NPC wave encounters' },
        { title: '🏆 Achievements', href: '/wiki/achievements', description: 'Achievements for defeating bosses' },
        { title: '💰 Trading', href: '/wiki/trading', description: 'NPC trader interactions' },
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
