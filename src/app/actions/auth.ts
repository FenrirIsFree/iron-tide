'use server'

import { createServerSupabaseClient } from '@/lib/supabase-server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string
  const inGameName = (formData.get('inGameName') as string) || null

  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) {
    return { error: error.message }
  }

  if (data.user) {
    try {
      await prisma.user.create({
        data: {
          email,
          username,
          inGameName,
          supabaseId: data.user.id,
          rank: 'CABIN_BOY',
        },
      })
    } catch (e: any) {
      return { error: e.message?.includes('Unique') ? 'Username or email already taken' : 'Failed to create user profile' }
    }
  }

  return { success: true }
}

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  redirect('/dashboard')
}

export async function signOut() {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  redirect('/login')
}
