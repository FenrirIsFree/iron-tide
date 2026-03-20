import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import TradingContent from './TradingContent'
import { getTrading } from '@/lib/gameData'

export const metadata = {
  title: 'Trading — The Iron Tide Wiki',
  description: 'Trading guide for World of Sea Battle — trade goods, prices, margins, tax rates, and trader offers.',
}

export default function TradingPage() {
  const trading = getTrading()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4 max-w-5xl mx-auto w-full">
        <WikiBreadcrumb current="Trading" />
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">💰 Trading</h1>
          <p className="text-foreground-secondary mt-1">
            Trade goods, price ranges, tax rates, and trader offers
          </p>
        </div>
        <TradingContent trading={trading} />
      </main>
      <Footer />
    </div>
  )
}
