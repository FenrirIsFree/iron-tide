'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@/lib/supabase'

export default function HeroButtons() {
  const [authState, setAuthState] = useState<'loading' | 'in' | 'out'>('loading')

  useEffect(() => {
    const supabase = createBrowserClient()
    supabase.auth.getUser().then(({ data }) => {
      setAuthState(data.user ? 'in' : 'out')
    })
  }, [])

  if (authState === 'loading') return null

  if (authState === 'in') {
    return (
      <Link
        href="/dashboard"
        className="px-8 py-3 text-lg font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-primary-hover transition-colors"
      >
        Dashboard
      </Link>
    )
  }

  return (
    <>
      <Link
        href="/login"
        className="px-8 py-3 text-lg font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-primary-hover transition-colors"
      >
        Member Login
      </Link>
      <Link
        href="/signup"
        className="px-8 py-3 text-lg font-semibold text-accent border-2 border-accent rounded-lg hover:bg-accent hover:text-background transition-colors"
      >
        Join The Crew
      </Link>
    </>
  )
}
