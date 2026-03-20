'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'

interface WikiItem {
  title: string
  desc: string
  href: string
  count: string
  category: string
  keywords?: string[]
}

interface WikiSection {
  heading: string
  items: WikiItem[]
}

interface WikiHubClientProps {
  sections: WikiSection[]
  totalPages: number
  totalItems: number
}

export default function WikiHubClient({ sections, totalPages, totalItems }: WikiHubClientProps) {
  const [query, setQuery] = useState('')

  const allItems = useMemo(() => sections.flatMap(s => s.items), [sections])

  const filtered = useMemo(() => {
    if (!query.trim()) return null
    const q = query.toLowerCase()
    return allItems.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.keywords?.some(k => k.toLowerCase().includes(q))
    )
  }, [query, allItems])

  return (
    <div>
      {/* Stats bar */}
      <div className="mb-6 flex items-center gap-2 text-xs text-foreground-muted bg-surface border border-surface-border rounded-lg px-4 py-2.5">
        <span className="text-accent font-semibold">{totalPages} pages</span>
        <span>covering</span>
        <span className="text-accent font-semibold">{totalItems.toLocaleString()} items</span>
        <span>from decompiled game data</span>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
          <svg className="h-4 w-4 text-foreground-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search wiki pages…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full bg-surface border border-surface-border rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-accent transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute inset-y-0 right-3 flex items-center text-foreground-muted hover:text-foreground"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search results */}
      {filtered !== null ? (
        <div>
          <p className="text-sm text-foreground-muted mb-4">
            {filtered.length === 0 ? 'No results found.' : `${filtered.length} result${filtered.length === 1 ? '' : 's'}`}
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="block bg-surface border border-surface-border rounded-xl p-4 hover:border-accent hover:bg-surface-hover transition-colors group"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>
                  <span className="text-xs text-foreground-muted whitespace-nowrap">{item.count}</span>
                </div>
                <p className="text-xs text-foreground-muted mb-2 leading-relaxed">{item.desc}</p>
                <span className="text-xs text-accent/70">{item.category}</span>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        /* Normal category grid */
        <div className="space-y-8">
          {sections.map(section => (
            <div key={section.heading}>
              <h2 className="text-sm font-semibold text-foreground-secondary uppercase tracking-wider mb-3">
                {section.heading}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {section.items.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-start justify-between gap-3 bg-surface border border-surface-border rounded-xl px-4 py-3 hover:border-accent hover:bg-surface-hover transition-colors group"
                  >
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors truncate">
                        {item.title}
                      </h3>
                      <p className="text-xs text-foreground-muted mt-0.5 leading-relaxed line-clamp-2">{item.desc}</p>
                    </div>
                    <span className="text-xs text-accent font-medium whitespace-nowrap flex-shrink-0 mt-0.5">{item.count}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
