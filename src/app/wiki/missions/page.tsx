import fs from 'fs'
import path from 'path'
import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import MissionsContent from './MissionsContent'
import SeeAlso from '@/components/wiki/SeeAlso'
import NavBox from '@/components/wiki/NavBox'

export const metadata = {
  title: 'PvE Missions — The Iron Tide Wiki',
  description: 'All PvE missions in World of Sea Battle — wave compositions, rewards, difficulty, and ship requirements.',
}

interface MissionRaw {
  _raw: {
    MapName: string
    IntroductionKey: string
    Flags: string
    MaxShipRank: string
    ScrollsCost: number
    MarksBonus: number
    VSkullsBonus: number
    Mode: string
    PlayersCount: number
    Waves: { NPCS: { SourceType: string; Source: number; Count: number }[] }[]
  }
}

export default function MissionsPage() {
  const dir = path.join(process.cwd(), 'game-data')
  const missions = JSON.parse(fs.readFileSync(path.join(dir, 'wiki-pve-missions.json'), 'utf-8')) as MissionRaw[]
  const localization = JSON.parse(fs.readFileSync(path.join(dir, 'raw', 'localization_en.json'), 'utf-8')) as Record<string, string>

  // Enrich missions with names from localization
  const enriched = missions.map(m => {
    const mapKey = m._raw.MapName
    const descKey = m._raw.IntroductionKey
    return {
      name: localization[mapKey] || mapKey,
      description: localization[descKey] || '',
      maxShipRank: m._raw.MaxShipRank,
      scrollsCost: m._raw.ScrollsCost,
      marksBonus: m._raw.MarksBonus,
      skullsBonus: m._raw.VSkullsBonus,
      mode: m._raw.Mode,
      players: m._raw.PlayersCount,
      flags: m._raw.Flags,
      waves: (Array.isArray(m._raw.Waves) ? m._raw.Waves : []).map(w => ({
        enemies: (w.NPCS || []).map(n => ({ type: n.SourceType, level: n.Source, count: n.Count }))
      })),
    }
  })

  return (
    <main className="flex-1 pt-8 pb-12 px-4 max-w-5xl mx-auto w-full">
      <WikiBreadcrumb current="PvE Missions" />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">⚔️ PvE Missions</h1>
        <p className="text-foreground-secondary mt-1">
          {enriched.length} missions — battle NPC waves for marks and skulls
        </p>
      </div>
      <MissionsContent missions={enriched} />
      <SeeAlso items={[
        { title: '🚢 Ships', href: '/wiki/ships', description: 'Ship rank requirements for each mission' },
        { title: '💀 NPCs & Bosses', href: '/wiki/npcs', description: 'NPC types encountered in mission waves' },
        { title: '🏆 Achievements', href: '/wiki/achievements', description: 'Achievements earned from missions' },
        { title: '⚓ Ports', href: '/wiki/ports', description: 'Ports where missions are launched' },
        { title: '🧭 Captain Skills', href: '/wiki/skills', description: 'Skills that boost mission rewards' },
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
