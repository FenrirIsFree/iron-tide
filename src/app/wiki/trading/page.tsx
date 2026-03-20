import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import TradingContent from './TradingContent'
import { getTrading } from '@/lib/gameData'
import NavBox from '@/components/wiki/NavBox'
import SeeAlso from '@/components/wiki/SeeAlso'

export const metadata = {
  title: 'Trading — The Iron Tide Wiki',
  description: 'Trading guide for World of Sea Battle — trade goods, prices, margins, tax rates, and trader offers.',
}

export default function TradingPage() {
  const trading = getTrading()

  return (
    <main className="flex-1 pt-8 pb-12 px-4 max-w-5xl mx-auto w-full">
      <WikiBreadcrumb current="Trading" />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">💰 Trading</h1>
        <p className="text-foreground-secondary mt-1">
          Trade goods, price ranges, tax rates, and trader offers
        </p>
      </div>
      <TradingContent trading={trading} />
      <SeeAlso items={[
        { title: '⚓ Ports', href: '/wiki/ports', description: 'Ports where goods are bought and sold' },
        { title: '💎 Resources', href: '/wiki/resources', description: 'Raw resources and trade goods' },
        { title: '🔨 Crafting', href: '/wiki/crafting', description: 'Craft trade goods for higher margins' },
        { title: '🧭 Captain Skills', href: '/wiki/skills', description: 'Exploration skills boost trade profits' },
        { title: '⚜️ Guilds', href: '/wiki/guilds', description: 'Guild shared trading economy' },
      ]} />
      <NavBox
        category="World"
        icon="🌍"
        items={[
          { label: 'Ports', href: '/wiki/ports' },
          { label: 'Resources', href: '/wiki/resources' },
          { label: 'Trading', href: '/wiki/trading' },
          { label: 'Missions (PvE)', href: '/wiki/missions' },
        ]}
      />
    </main>
  )
}
