import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import CombatGuide from './CombatGuide'
import SeeAlso from '@/components/wiki/SeeAlso'
import NavBox from '@/components/wiki/NavBox'

export const metadata = {
  title: 'Combat Guide — The Iron Tide Wiki',
  description: 'Complete combat guide for World of Sea Battle — damage formulas, armor mechanics, cannons, mortars, boarding, weather, and more.',
}

export default function CombatPage() {
  return (
    <main className="flex-1 pt-8 pb-12 px-4 max-w-5xl mx-auto w-full">
      <WikiBreadcrumb current="Combat Guide" />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">⚔️ Combat Guide</h1>
        <p className="text-foreground-secondary mt-1">
          Everything about combat — from decompiled game code and real PvP packet data
        </p>
      </div>
      <CombatGuide />
      <SeeAlso items={[
        { title: '🔫 Weapons', href: '/wiki/weapons', description: 'All 42 weapons — damage, range, and reload stats' },
        { title: '💣 Ammunition', href: '/wiki/ammo', description: 'Damage modifiers and special effects for each ammo type' },
        { title: '🛠️ Ship Upgrades', href: '/wiki/upgrades', description: 'Boost your ship\'s combat performance' },
        { title: '🚢 Ships', href: '/wiki/ships', description: 'Browse all 62 ships with full stats' },
        { title: '⚙️ Game Mechanics', href: '/wiki/mechanics', description: 'Technical deep-dive into all game systems' },
        { title: '🏟️ Arena', href: '/wiki/arena', description: 'PvP arena mode — apply your combat skills' },
      ]} />
      <NavBox
        category="Combat"
        icon="⚔️"
        items={[
          { label: 'Combat Guide', href: '/wiki/combat' },
          { label: 'Weapons', href: '/wiki/weapons' },
          { label: 'Ammo Types', href: '/wiki/ammo' },
          { label: 'Ship Upgrades', href: '/wiki/upgrades' },
          { label: 'Game Mechanics', href: '/wiki/mechanics' },
        ]}
      />
    </main>
  )
}
