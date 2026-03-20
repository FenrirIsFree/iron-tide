import { getWeapons } from '@/lib/gameData'
import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import WeaponTable from './WeaponTable'
import SeeAlso from '@/components/wiki/SeeAlso'
import NavBox from '@/components/wiki/NavBox'

export const metadata = {
  title: 'Weapons — The Iron Tide Wiki',
  description: 'All 42 weapons in World of Sea Battle — damage, range, reload, and crafting info.',
}

export default function WeaponsPage() {
  const weapons = getWeapons()

  return (
    <main className="flex-1 pt-8 pb-12 px-4 max-w-7xl mx-auto w-full">
      <WikiBreadcrumb current="Weapons" />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">🔫 Weapon Database</h1>
        <p className="text-foreground-secondary mt-1">
          {weapons.length} weapons — cannons, mortars, and special armaments
        </p>
      </div>
      <WeaponTable weapons={weapons} />
      <SeeAlso items={[
        { title: '💣 Ammunition', href: '/wiki/ammo', description: 'Damage modifiers for each ammo type' },
        { title: '⚔️ Combat Guide', href: '/wiki/combat', description: 'How weapon damage is calculated in combat' },
        { title: '🚢 Ships', href: '/wiki/ships', description: 'Which ships can mount these weapons' },
        { title: '🛠️ Ship Upgrades', href: '/wiki/upgrades', description: 'Upgrades that boost weapon performance' },
        { title: '🔨 Crafting', href: '/wiki/crafting', description: 'Craft weapons from resources' },
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
