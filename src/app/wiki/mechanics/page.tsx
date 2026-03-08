import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MechanicsContent from './MechanicsContent'
import fs from 'fs'
import path from 'path'

export const metadata = {
  title: 'Game Mechanics — The Iron Tide Wiki',
  description: 'Speed, combat, boarding, crew, and economy systems in World of Sea Battle.',
}

function loadMechanics() {
  const dir = path.join(process.cwd(), 'game-data')
  return JSON.parse(fs.readFileSync(path.join(dir, 'wiki-game-mechanics.json'), 'utf-8'))
}

export default function MechanicsPage() {
  const mechanics = loadMechanics()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4 max-w-5xl mx-auto w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">⚙️ Game Mechanics</h1>
          <p className="text-foreground-secondary mt-1">
            Deep dive into World of Sea Battle systems — extracted from decompiled source code
          </p>
        </div>
        <MechanicsContent mechanics={mechanics} />
      </main>
      <Footer />
    </div>
  )
}
