import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import UpgradesContent from './UpgradesContent'
import { getUpgrades } from '@/lib/gameData'

export const metadata = {
  title: 'Ship Upgrades — The Iron Tide Wiki',
  description: 'All ship upgrades in World of Sea Battle — effects, costs, wear mechanics, and ranked values.',
}

export default function UpgradesPage() {
  const upgrades = getUpgrades()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4 max-w-5xl mx-auto w-full">
        <WikiBreadcrumb current="Ship Upgrades" />
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">🛠️ Ship Upgrades</h1>
          <p className="text-foreground-secondary mt-1">
            {upgrades.length} upgrades — equip your ship with combat, speed, and utility improvements
          </p>
        </div>
        <UpgradesContent upgrades={upgrades} />
      </main>
      <Footer />
    </div>
  )
}
