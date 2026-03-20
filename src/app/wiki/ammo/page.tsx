import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import AmmoContent from './AmmoContent'
import { getAmmo } from '@/lib/gameData'
import SeeAlso from '@/components/wiki/SeeAlso'
import NavBox from '@/components/wiki/NavBox'

export const metadata = {
  title: 'Ammunition — The Iron Tide Wiki',
  description: 'All ammo types in World of Sea Battle — damage factors, sail damage, crew damage, and special effects.',
}

export default function AmmoPage() {
  const ammo = getAmmo()

  return (
    <main className="flex-1 pt-8 pb-12 px-4 max-w-5xl mx-auto w-full">
      <WikiBreadcrumb current="Ammunition" />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">💣 Ammunition</h1>
        <p className="text-foreground-secondary mt-1">
          {ammo.length} ammo types — each changes how your cannons perform
        </p>
      </div>
      <AmmoContent ammo={ammo} />
      <SeeAlso items={[
        { title: '🔫 Weapons', href: '/wiki/weapons', description: 'Cannons and mortars that fire this ammo' },
        { title: '⚔️ Combat Guide', href: '/wiki/combat', description: 'How ammo interacts with armor and damage formulas' },
        { title: '🚢 Ships', href: '/wiki/ships', description: 'Choose the right ship for your ammo strategy' },
        { title: '🔨 Crafting', href: '/wiki/crafting', description: 'Craft ammo from resources' },
        { title: '🛠️ Ship Upgrades', href: '/wiki/upgrades', description: 'Upgrades that affect ammunition performance' },
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
