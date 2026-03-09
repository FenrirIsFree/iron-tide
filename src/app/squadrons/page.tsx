import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import prisma from '@/lib/prisma'
import { getSquadrons } from '@/app/actions/squadron'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SquadronClient from './SquadronClient'

export default async function SquadronsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    select: { id: true, rank: true },
  })

  const squadrons = await getSquadrons()
  const isLeader = dbUser?.rank === 'FOUNDER' || dbUser?.rank === 'ADMIRAL'

  // Only fetch guild fleet for leaders
  let guildFleet: Awaited<ReturnType<typeof import('@/app/actions/squadron').getGuildFleet>> | null = null
  if (isLeader) {
    const { getGuildFleet } = await import('@/app/actions/squadron')
    guildFleet = await getGuildFleet()
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4 max-w-6xl mx-auto w-full">
        <SquadronClient
          squadrons={JSON.parse(JSON.stringify(squadrons))}
          guildFleet={guildFleet ? JSON.parse(JSON.stringify(guildFleet)) : null}
          currentUserId={dbUser?.id ?? ''}
          currentUserRank={dbUser?.rank ?? 'CABIN_BOY'}
        />
      </main>
      <Footer />
    </div>
  )
}
