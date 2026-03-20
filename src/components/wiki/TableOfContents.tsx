'use client'

import { useEffect, useState, useRef } from 'react'

interface TocEntry {
  id: string
  text: string
  level: number
}

export default function TableOfContents() {
  const [entries, setEntries] = useState<TocEntry[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    // Scan the page for h2/h3 headings inside the wiki content area
    const headings = Array.from(
      document.querySelectorAll('main h2[id], main h3[id]')
    ) as HTMLElement[]

    const tocEntries: TocEntry[] = headings.map(el => ({
      id: el.id,
      text: el.textContent?.replace(/^[^\w]+/, '').trim() ?? '',
      level: el.tagName === 'H2' ? 2 : 3,
    }))

    setEntries(tocEntries)

    // IntersectionObserver to highlight active section
    observerRef.current?.disconnect()

    const observer = new IntersectionObserver(
      entries => {
        // Find topmost visible heading
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => {
            const aTop = (a.target as HTMLElement).getBoundingClientRect().top
            const bTop = (b.target as HTMLElement).getBoundingClientRect().top
            return aTop - bTop
          })

        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      {
        rootMargin: '-64px 0px -60% 0px',
        threshold: 0,
      }
    )

    headings.forEach(el => observer.observe(el))
    observerRef.current = observer

    return () => observer.disconnect()
  }, [])

  const handleClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top, behavior: 'smooth' })
      setActiveId(id)
    }
  }

  if (entries.length < 2) return null

  return (
    <aside className="hidden xl:block w-56 flex-shrink-0">
      <div className="sticky top-20">
        <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-3">
          Contents
        </p>
        <nav className="space-y-0.5">
          {entries.map(entry => (
            <a
              key={entry.id}
              href={`#${entry.id}`}
              onClick={e => handleClick(entry.id, e)}
              className={`block text-sm transition-colors py-0.5 ${
                entry.level === 3 ? 'pl-3' : ''
              } ${
                activeId === entry.id
                  ? 'text-accent font-medium'
                  : 'text-foreground-muted hover:text-foreground-secondary'
              }`}
            >
              {entry.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  )
}
