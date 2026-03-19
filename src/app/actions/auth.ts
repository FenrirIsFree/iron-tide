'use server'

import { createServerSupabaseClient } from '@/lib/supabase-server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { signUpSchema, signInSchema } from '@/lib/validation'

export async function signUp(formData: FormData) {
  const parsed = signUpSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    username: formData.get('username'),
    inGameName: formData.get('inGameName') || null,
  })

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors
    const firstError = Object.values(errors).flat()[0] || 'Invalid input'
    return { error: firstError }
  }

  const { email, password, username, inGameName } = parsed.data
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
  const parsed = signInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { error: 'Invalid email or password' }
  }

  const { email, password } = parsed.data
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
