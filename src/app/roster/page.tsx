import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import prisma from '@/lib/prisma'
import { getMembers } from '@/app/actions/roster'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import RosterClient from './RosterClient'

export default async function RosterPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id }, select: { id: true, rank: true } })
  const members = await getMembers()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4 max-w-5xl mx-auto w-full">
        <RosterClient
          members={JSON.parse(JSON.stringify(members))}
          currentUserId={dbUser?.id ?? ''}
          currentUserRank={dbUser?.rank ?? 'CABIN_BOY'}
        />
      </main>
      <Footer />
    </div>
  )
}
