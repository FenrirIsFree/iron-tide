import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import CosmeticsContent from './CosmeticsContent'
import { getCosmetics } from '@/lib/gameData'

export const metadata = {
  title: 'Ship Cosmetics — The Iron Tide Wiki',
  description: 'All ship customization in World of Sea Battle — flags, sails, figureheads, decals, and full ship designs.',
}

export default function CosmeticsPage() {
  const cosmetics = getCosmetics()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4 max-w-5xl mx-auto w-full">
        <WikiBreadcrumb current="Cosmetics" />
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">🎨 Ship Cosmetics</h1>
          <p className="text-foreground-secondary mt-1">
            {cosmetics.length} customization items — flags, sails, figureheads, decals, and full ship designs
          </p>
        </div>
        <CosmeticsContent cosmetics={cosmetics} />
      </main>
      <Footer />
    </div>
  )
}
