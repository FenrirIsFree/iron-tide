import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import ShipDetail from './ShipDetail'
import { getShips, getShipBySlug, getAllShipSlugs, toSlug } from '@/lib/gameData'

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
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4 max-w-5xl mx-auto w-full">
        <WikiBreadcrumb current={ship.name} parent={{ label: 'Ships', href: '/wiki/ships' }} />
        <ShipDetail
          ship={ship}
          prev={prev ? { name: prev.name, slug: toSlug(prev.name) } : null}
          next={next ? { name: next.name, slug: toSlug(next.name) } : null}
        />
      </main>
      <Footer />
    </div>
  )
}
