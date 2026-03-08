import { getWeapons } from '@/lib/gameData'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WeaponTable from './WeaponTable'

export const metadata = {
  title: 'Weapons — The Iron Tide Wiki',
  description: 'All 42 weapons in World of Sea Battle — damage, range, reload, and crafting info.',
}

export default function WeaponsPage() {
  const weapons = getWeapons()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4 max-w-7xl mx-auto w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">🔫 Weapon Database</h1>
          <p className="text-foreground-secondary mt-1">
            {weapons.length} weapons — cannons, mortars, and special armaments
          </p>
        </div>
        <WeaponTable weapons={weapons} />
      </main>
      <Footer />
    </div>
  )
}
