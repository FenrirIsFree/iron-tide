import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import MechanicsContent from './MechanicsContent'
import fs from 'fs'
import path from 'path'
import SeeAlso from '@/components/wiki/SeeAlso'
import NavBox from '@/components/wiki/NavBox'

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
    <main className="flex-1 pt-8 pb-12 px-4 max-w-5xl mx-auto w-full">
      <WikiBreadcrumb current="Game Mechanics" />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">⚙️ Game Mechanics</h1>
        <p className="text-foreground-secondary mt-1">
          Deep dive into World of Sea Battle systems — extracted from decompiled source code
        </p>
      </div>
      <MechanicsContent mechanics={mechanics} />
      <SeeAlso items={[
        { title: '⚔️ Combat Guide', href: '/wiki/combat', description: 'Applied combat mechanics and formulas' },
        { title: '🚢 Ships', href: '/wiki/ships', description: 'Ship stats affected by game mechanics' },
        { title: '🔫 Weapons', href: '/wiki/weapons', description: 'Weapon mechanics and damage calculations' },
        { title: '⭐ Ranks', href: '/wiki/ranks', description: 'Rank progression mechanics' },
        { title: '🧭 Captain Skills', href: '/wiki/skills', description: 'Skill system mechanics' },
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
