import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import AmmoContent from './AmmoContent'
import { getAmmo } from '@/lib/gameData'

export const metadata = {
  title: 'Ammunition — The Iron Tide Wiki',
  description: 'All ammo types in World of Sea Battle — damage factors, sail damage, crew damage, and special effects.',
}

export default function AmmoPage() {
  const ammo = getAmmo()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4 max-w-5xl mx-auto w-full">
        <WikiBreadcrumb current="Ammunition" />
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">💣 Ammunition</h1>
          <p className="text-foreground-secondary mt-1">
            {ammo.length} ammo types — each changes how your cannons perform
          </p>
        </div>
        <AmmoContent ammo={ammo} />
      </main>
      <Footer />
    </div>
  )
}
