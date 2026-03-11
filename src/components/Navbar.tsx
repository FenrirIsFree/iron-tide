'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@/lib/supabase'
import { signOut } from '@/app/actions/auth'

export default function Navbar() {
  const [authState, setAuthState] = useState<'loading' | 'in' | 'out'>('loading')
  const [username, setUsername] = useState<string>('')

  useEffect(() => {
    const supabase = createBrowserClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setAuthState('in')
        fetch('/api/me').then(r => r.json()).then(d => {
          if (d.user) setUsername(d.user.username)
        })
      } else {
        setAuthState('out')
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setAuthState('in')
        fetch('/api/me').then(r => r.json()).then(d => {
          if (d.user) setUsername(d.user.username)
        })
      } else {
        setAuthState('out')
        setUsername('')
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-accent font-bold text-xl tracking-wide">
          ⚓ The Iron Tide
        </Link>
        <div className="flex items-center gap-3">
          {authState === 'loading' ? null : authState === 'in' ? (
            <>
              <Link href="/dashboard" className="text-foreground-secondary text-sm hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link href="/fleet" className="text-foreground-secondary text-sm hover:text-foreground transition-colors">
                Fleet
              </Link>
              <Link href="/inventory" className="text-foreground-secondary text-sm hover:text-foreground transition-colors">
                Inventory
              </Link>
              <Link href="/roster" className="text-foreground-secondary text-sm hover:text-foreground transition-colors">
                Roster
              </Link>
              <Link href="/squadrons" className="text-foreground-secondary text-sm hover:text-foreground transition-colors">
                Squadrons
              </Link>
              <Link href="/wiki" className="text-foreground-secondary text-sm hover:text-foreground transition-colors">
                Wiki
              </Link>
              <span className="text-accent text-sm font-medium">
                {username || '...'}
              </span>
              <form action={signOut}>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary-hover transition-colors">
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/wiki" className="text-foreground-secondary text-sm hover:text-foreground transition-colors">
                Wiki
              </Link>
              <Link href="/login" className="px-4 py-2 text-sm font-medium text-accent border border-accent rounded-lg hover:bg-accent hover:text-background transition-colors">
                Login
              </Link>
              <Link href="/signup" className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary-hover transition-colors">
                Join
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
