'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@/lib/supabase'
import { signOut } from '@/app/actions/auth'

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', auth: true },
  { href: '/fleet', label: 'Fleet', auth: true },
  { href: '/inventory', label: 'Inventory', auth: true },
  { href: '/roster', label: 'Roster', auth: true },
  { href: '/squadrons', label: 'Squadrons', auth: true },
  { href: '/wiki', label: 'Wiki', auth: false },
]

export default function Navbar() {
  const [authState, setAuthState] = useState<'loading' | 'in' | 'out'>('loading')
  const [username, setUsername] = useState<string>('')
  const [menuOpen, setMenuOpen] = useState(false)

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

  const visibleLinks = navLinks.filter(l => !l.auth || authState === 'in')

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-accent font-bold text-xl tracking-wide" onClick={() => setMenuOpen(false)}>
          ⚓ The Iron Tide
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-3">
          {authState === 'loading' ? null : authState === 'in' ? (
            <>
              {visibleLinks.map(l => (
                <Link key={l.href} href={l.href} className="text-foreground-secondary text-sm hover:text-foreground transition-colors">
                  {l.label}
                </Link>
              ))}
              <span className="text-accent text-sm font-medium">{username || '...'}</span>
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

        {/* Mobile hamburger button */}
        <button
          className="md:hidden text-foreground-secondary hover:text-foreground p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-surface-border bg-background/95 backdrop-blur-sm">
          <div className="px-4 py-4 space-y-3">
            {authState === 'loading' ? null : authState === 'in' ? (
              <>
                {visibleLinks.map(l => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="block text-foreground-secondary text-sm hover:text-foreground transition-colors py-1"
                    onClick={() => setMenuOpen(false)}
                  >
                    {l.label}
                  </Link>
                ))}
                <div className="pt-2 border-t border-surface-border flex items-center justify-between">
                  <span className="text-accent text-sm font-medium">{username || '...'}</span>
                  <form action={signOut}>
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary-hover transition-colors">
                      Logout
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <>
                <Link href="/wiki" className="block text-foreground-secondary text-sm hover:text-foreground transition-colors py-1" onClick={() => setMenuOpen(false)}>
                  Wiki
                </Link>
                <div className="pt-2 border-t border-surface-border flex gap-3">
                  <Link href="/login" className="flex-1 text-center px-4 py-2 text-sm font-medium text-accent border border-accent rounded-lg hover:bg-accent hover:text-background transition-colors" onClick={() => setMenuOpen(false)}>
                    Login
                  </Link>
                  <Link href="/signup" className="flex-1 text-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary-hover transition-colors" onClick={() => setMenuOpen(false)}>
                    Join
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
