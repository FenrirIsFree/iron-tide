import { getNpcs } from '@/lib/gameData'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import NpcContent from './NpcContent'

export const metadata = {
  title: 'NPCs & Bosses — The Iron Tide Wiki',
  description: 'NPC types, named bosses, loot tables, and combat mechanics in World of Sea Battle.',
}

export default function NpcsPage() {
  const npcs = getNpcs()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4 max-w-7xl mx-auto w-full">
        <WikiBreadcrumb current="NPCs & Bosses" />
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">💀 NPCs & Bosses</h1>
          <p className="text-foreground-secondary mt-1">
            {npcs.npcTypes.length} NPC types · {npcs.bosses.length} named bosses
          </p>
        </div>
        <NpcContent npcs={npcs as any} />
      </main>
      <Footer />
    </div>
  )
}
