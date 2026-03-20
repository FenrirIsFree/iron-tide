import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import ShipDetail from './ShipDetail'
import { getShips, getShipBySlug, getAllShipSlugs, toSlug } from '@/lib/gameData'
import SeeAlso from '@/components/wiki/SeeAlso'
import NavBox from '@/components/wiki/NavBox'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllShipSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const ship = getShipBySlug(slug)
  if (!ship) return { title: 'Ship Not Found — The Iron Tide Wiki' }

  return {
    title: `${ship.name} — The Iron Tide Wiki`,
    description: ship.description
      ? `${ship.name}: ${ship.description.slice(0, 150)}...`
      : `${ship.name} — ${ship.displayClass} ${ship.inGameClass || 'ship'} in World of Sea Battle. HP: ${ship.health}, Speed: ${ship.speed}, Armor: ${ship.armor}.`,
  }
}

export default async function ShipPage({ params }: PageProps) {
  const { slug } = await params
  const ship = getShipBySlug(slug)
  if (!ship) notFound()

  // Get prev/next ships for navigation
  const allShips = getShips().sort((a, b) => a.name.localeCompare(b.name))
  const idx = allShips.findIndex(s => toSlug(s.name) === slug)
  const prev = idx > 0 ? allShips[idx - 1] : null
  const next = idx < allShips.length - 1 ? allShips[idx + 1] : null

  return (
    <main className="flex-1 pt-8 pb-12 px-4 max-w-5xl mx-auto w-full">
      <WikiBreadcrumb current={ship.name} parent={{ label: 'Ships', href: '/wiki/ships' }} />
      <ShipDetail
        ship={ship}
        prev={prev ? { name: prev.name, slug: toSlug(prev.name) } : null}
        next={next ? { name: next.name, slug: toSlug(next.name) } : null}
      />
      <SeeAlso items={[
        { title: '🔫 Weapons', href: '/wiki/weapons', description: 'Weapons compatible with this ship class' },
        { title: '🛠️ Ship Upgrades', href: '/wiki/upgrades', description: 'Upgrades to equip on this ship' },
        { title: '👥 Crew & Units', href: '/wiki/crew', description: 'Crew units for boarding and combat' },
        { title: '💣 Ammunition', href: '/wiki/ammo', description: 'Ammo types for your ship\'s cannons' },
        { title: '🔨 Crafting', href: '/wiki/crafting', description: 'Crafting cost and blueprint requirements' },
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
