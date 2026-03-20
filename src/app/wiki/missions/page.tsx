import fs from 'fs'
import path from 'path'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import MissionsContent from './MissionsContent'

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
      waves: m._raw.Waves.map(w => ({
        enemies: w.NPCS.map(n => ({ type: n.SourceType, level: n.Source, count: n.Count }))
      })),
    }
  })

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4 max-w-5xl mx-auto w-full">
        <WikiBreadcrumb current="PvE Missions" />
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">⚔️ PvE Missions</h1>
          <p className="text-foreground-secondary mt-1">
            {enriched.length} missions — battle NPC waves for marks and skulls
          </p>
        </div>
        <MissionsContent missions={enriched} />
      </main>
      <Footer />
    </div>
  )
}
