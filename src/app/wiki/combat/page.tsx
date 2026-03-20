import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import CombatGuide from './CombatGuide'

export const metadata = {
  title: 'Combat Guide — The Iron Tide Wiki',
  description: 'Complete combat guide for World of Sea Battle — damage formulas, armor mechanics, cannons, mortars, boarding, weather, and more.',
}

export default function CombatPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4 max-w-5xl mx-auto w-full">
        <WikiBreadcrumb current="Combat Guide" />
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">⚔️ Combat Guide</h1>
          <p className="text-foreground-secondary mt-1">
            Everything about combat — from decompiled game code and real PvP packet data
          </p>
        </div>
        <CombatGuide />
      </main>
      <Footer />
    </div>
  )
}
