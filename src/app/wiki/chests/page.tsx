import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import ChestsContent from './ChestsContent'
import fs from 'fs'
import path from 'path'

export const metadata = {
  title: 'Chests — The Iron Tide Wiki',
  description: 'Complete loot tables for all chests in World of Sea Battle — drop rates, rewards, and ship chances.',
}

function loadChestData() {
  const dir = path.join(process.cwd(), 'game-data')
  const ships = JSON.parse(fs.readFileSync(path.join(dir, 'wiki-ships.json'), 'utf-8'))
  const large = JSON.parse(fs.readFileSync(path.join(dir, 'wiki-chest-rewards.json'), 'utf-8'))
  const imperial = JSON.parse(fs.readFileSync(path.join(dir, 'wiki-empire-chest-rewards.json'), 'utf-8'))
  const inca = JSON.parse(fs.readFileSync(path.join(dir, 'wiki-incas-chest-rewards.json'), 'utf-8'))
  const newYear = JSON.parse(fs.readFileSync(path.join(dir, 'wiki-newyear-chest-rewards.json'), 'utf-8'))
  return { ships, large, imperial, inca, newYear }
}

export default function ChestsPage() {
  const data = loadChestData()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4 max-w-7xl mx-auto w-full">
        <WikiBreadcrumb current="Chests" />
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">🎁 Chests & Loot Tables</h1>
          <p className="text-foreground-secondary mt-1">
            Complete drop rates for every chest — datamined from game source code
          </p>
        </div>
        <ChestsContent data={data as any} />
      </main>
      <Footer />
    </div>
  )
}
