import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import UpgradesContent from './UpgradesContent'
import { getUpgrades } from '@/lib/gameData'
import SeeAlso from '@/components/wiki/SeeAlso'
import NavBox from '@/components/wiki/NavBox'

export const metadata = {
  title: 'Ship Upgrades — The Iron Tide Wiki',
  description: 'All ship upgrades in World of Sea Battle — effects, costs, wear mechanics, and ranked values.',
}

export default function UpgradesPage() {
  const upgrades = getUpgrades()

  return (
    <main className="flex-1 pt-8 pb-12 px-4 max-w-5xl mx-auto w-full">
      <WikiBreadcrumb current="Ship Upgrades" />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">🛠️ Ship Upgrades</h1>
        <p className="text-foreground-secondary mt-1">
          {upgrades.length} upgrades — equip your ship with combat, speed, and utility improvements
        </p>
      </div>
      <UpgradesContent upgrades={upgrades} />
      <SeeAlso items={[
        { title: '🚢 Ships', href: '/wiki/ships', description: 'Ships that can equip upgrades' },
        { title: '💎 Resources', href: '/wiki/resources', description: 'Materials required to craft upgrades' },
        { title: '🔨 Crafting', href: '/wiki/crafting', description: 'Craft upgrades at the workshop' },
        { title: '⚔️ Combat Guide', href: '/wiki/combat', description: 'How upgrades affect combat performance' },
        { title: '🧭 Captain Skills', href: '/wiki/skills', description: 'Skills that enhance upgrade effects' },
      ]} />
      <NavBox
        category="Ships & Combat"
        icon="⚓"
        items={[
          { label: 'Ships', href: '/wiki/ships' },
          { label: 'Weapons', href: '/wiki/weapons' },
          { label: 'Ammo', href: '/wiki/ammo' },
          { label: 'Crew', href: '/wiki/crew' },
          { label: 'Upgrades', href: '/wiki/upgrades' },
          { label: 'Combat Guide', href: '/wiki/combat' },
        ]}
      />
    </main>
  )
}
