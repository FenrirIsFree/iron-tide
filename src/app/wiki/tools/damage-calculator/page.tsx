import { getWeapons, getAmmo, getShips } from '@/lib/gameData'
import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import SeeAlso from '@/components/wiki/SeeAlso'
import NavBox from '@/components/wiki/NavBox'
import DamageCalculatorClient from './DamageCalculatorClient'

export const metadata = {
  title: 'Damage Calculator — The Iron Tide Wiki',
  description: 'Calculate exact damage output in World of Sea Battle. Pick your cannon, ammo, and target — uses real game formulas from decompiled source code.',
}

export default function DamageCalculatorPage() {
  const weapons = getWeapons()
  const ammoList = getAmmo()
  const ships = getShips()

  return (
    <main className="flex-1 pt-8 pb-12 px-4 max-w-5xl mx-auto w-full">
      <WikiBreadcrumb current="Damage Calculator" parent={{ label: 'Tools', href: '/wiki/tools' }} />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">💥 Damage Calculator</h1>
        <p className="text-foreground-secondary mt-1">
          Real game formulas from decompiled source code — select weapon, ammo, and target to calculate exact damage output
        </p>
      </div>

      <DamageCalculatorClient weapons={weapons} ammoList={ammoList} ships={ships} />

      <SeeAlso items={[
        { title: '⚔️ Combat Guide', href: '/wiki/combat', description: 'Full explanation of the damage formula and armor mechanics' },
        { title: '🔫 Weapons', href: '/wiki/weapons', description: 'All weapons with penetration, reload, and range stats' },
        { title: '💣 Ammo Types', href: '/wiki/ammo', description: 'Damage multipliers for each ammo type' },
        { title: '🚢 Ship Database', href: '/wiki/ships', description: 'Ship HP and armor values' },
        { title: '🚢 Ship Comparison', href: '/wiki/tools/ship-compare', description: 'Compare ship stats side-by-side' },
      ]} />
      <NavBox
        category="Tools"
        icon="🛠️"
        items={[
          { label: 'Tools Hub', href: '/wiki/tools' },
          { label: 'Damage Calculator', href: '/wiki/tools/damage-calculator' },
          { label: 'Ship Comparison', href: '/wiki/tools/ship-compare' },
          { label: 'Crafting Calculator', href: '/wiki/tools/crafting-calculator' },
          { label: 'XP Calculator', href: '/wiki/tools/xp-calculator' },
        ]}
      />
    </main>
  )
}
