'use client'

import { useState } from 'react'
import WikiSidebar from '@/components/wiki/WikiSidebar'

interface WikiLayoutClientProps {
  children: React.ReactNode
}

export default function WikiLayoutClient({ children }: WikiLayoutClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <WikiSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      {/* Mobile hamburger button */}
      <button
        className="md:hidden fixed bottom-4 right-4 z-50 bg-primary text-primary-foreground w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-primary-hover transition-colors"
        onClick={() => setMobileOpen(v => !v)}
        aria-label="Toggle wiki navigation"
      >
        {mobileOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Main content */}
      <div className="md:ml-[260px] pt-16 min-h-screen flex flex-col">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </>
  )
}
