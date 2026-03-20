import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import PortsContent from './PortsContent'
import { getPorts } from '@/lib/gameData'
import NavBox from '@/components/wiki/NavBox'
import SeeAlso from '@/components/wiki/SeeAlso'

export const metadata = {
  title: 'Ports — The Iron Tide Wiki',
  description: 'All ports in World of Sea Battle — types, ship building ranks, resources, and bonuses.',
}

export default function PortsPage() {
  const ports = getPorts()

  return (
    <main className="flex-1 pt-8 pb-12 px-4 max-w-5xl mx-auto w-full">
      <WikiBreadcrumb current="Ports" />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">⚓ Ports</h1>
        <p className="text-foreground-secondary mt-1">
          {ports.length} ports — cities, bays, and pirate havens across the Archipelago
        </p>
      </div>
      <PortsContent ports={ports} />
      <SeeAlso items={[
        { title: '💰 Trading', href: '/wiki/trading', description: 'Trade goods between ports for profit' },
        { title: '💎 Resources', href: '/wiki/resources', description: 'Resources produced and sold at ports' },
        { title: '🚢 Ships', href: '/wiki/ships', description: 'Ships built at port shipyards' },
        { title: '⚔️ PvE Missions', href: '/wiki/missions', description: 'Missions launched from port locations' },
        { title: '⚜️ Guilds', href: '/wiki/guilds', description: 'Guild port conquest and control' },
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
