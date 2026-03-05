import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import prisma from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const rankLabels: Record<string, string> = {
  FOUNDER: '👑 Founder',
  ADMIRAL: '⚓ Admiral',
  COMMODORE: '🎖️ Commodore',
  OFFICER: '⚔️ Officer',
  MIDSHIPMAN: '🔱 Midshipman',
  SAILOR: '⛵ Sailor',
  CABIN_BOY: '🧹 Cabin Boy',
}

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } })

  const cards = [
    { title: '🚢 Fleet Tracker', desc: 'Manage your ships and loadouts', href: '/fleet' },
    { title: '📦 Resource Inventory', desc: 'Track resources and currencies', href: '/inventory' },
    { title: '👥 Guild Roster', desc: 'View crew members and ranks', href: '/roster' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4 max-w-5xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome, <span className="text-accent">{dbUser?.username ?? user.email?.split('@')[0]}</span>!
          </h1>
          {dbUser && (
            <p className="text-foreground-secondary mt-1">{rankLabels[dbUser.rank] ?? dbUser.rank}</p>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link key={card.href} href={card.href} className="block bg-surface border border-surface-border rounded-xl p-6 hover:border-accent hover:bg-surface-hover transition-colors">
              <h2 className="text-lg font-semibold text-foreground mb-2">{card.title}</h2>
              <p className="text-foreground-secondary text-sm">{card.desc}</p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
