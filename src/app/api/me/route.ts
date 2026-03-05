import { createServerSupabaseClient } from '@/lib/supabase-server'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ user: null })
  }

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    select: { username: true, inGameName: true, rank: true },
  })

  return NextResponse.json({ user: dbUser })
}
