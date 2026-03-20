'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'

interface NavItem {
  label: string
  href: string
  exists?: boolean
}

interface NavSection {
  id: string
  icon: string
  title: string
  items: NavItem[]
}

const NAV_SECTIONS: NavSection[] = [
  {
    id: 'getting-started',
    icon: '🚀',
    title: 'Getting Started',
    items: [
      { label: 'New Player Guide', href: '/wiki/getting-started' },
      { label: 'Choosing a Faction', href: '/wiki/factions' },
      { label: 'Economy Guide', href: '/wiki/economy' },
      { label: 'PvP Guide', href: '/wiki/pvp' },
    ],
  },
  {
    id: 'ships',
    icon: '🚢',
    title: 'Ships',
    items: [
      { label: 'Ship Database', href: '/wiki/ships' },
      { label: 'Ship Class Trees', href: '/wiki/ships/classes' },
    ],
  },
  {
    id: 'combat',
    icon: '⚔️',
    title: 'Combat',
    items: [
      { label: 'Combat Guide', href: '/wiki/combat' },
      { label: 'Weapons', href: '/wiki/weapons' },
      { label: 'Ammo Types', href: '/wiki/ammo' },
    ],
  },
  {
    id: 'crew',
    icon: '👥',
    title: 'Crew & Skills',
    items: [
      { label: 'Crew Types', href: '/wiki/crew' },
      { label: 'Captain Skills', href: '/wiki/skills' },
      { label: 'Ranks', href: '/wiki/ranks' },
    ],
  },
  {
    id: 'equipment',
    icon: '🔧',
    title: 'Equipment',
    items: [
      { label: 'Ship Upgrades', href: '/wiki/upgrades' },
      { label: 'Consumables', href: '/wiki/consumables' },
      { label: 'Crafting', href: '/wiki/crafting' },
    ],
  },
  {
    id: 'world',
    icon: '🌍',
    title: 'World',
    items: [
      { label: 'Ports', href: '/wiki/ports' },
      { label: 'Resources', href: '/wiki/resources' },
      { label: 'Trading', href: '/wiki/trading' },
      { label: 'Missions (PvE)', href: '/wiki/missions' },
    ],
  },
  {
    id: 'competitive',
    icon: '🏟️',
    title: 'Competitive',
    items: [
      { label: 'Arena', href: '/wiki/arena' },
      { label: 'Guilds', href: '/wiki/guilds' },
      { label: 'Achievements', href: '/wiki/achievements' },
      { label: 'Cosmetics', href: '/wiki/cosmetics' },
    ],
  },
  {
    id: 'game-data',
    icon: '📊',
    title: 'Game Data',
    items: [
      { label: 'Formulas & Mechanics', href: '/wiki/mechanics' },
      { label: 'NPC Guide', href: '/wiki/npcs' },
      { label: 'Chests & Loot', href: '/wiki/chests' },
    ],
  },
  {
    id: 'tools',
    icon: '🛠️',
    title: 'Tools',
    items: [
      { label: 'Tools Hub', href: '/wiki/tools' },
      { label: 'Damage Calculator', href: '/wiki/tools/damage-calculator' },
      { label: 'Ship Comparison', href: '/wiki/tools/ship-compare' },
      { label: 'Crafting Calculator', href: '/wiki/tools/crafting-calculator' },
      { label: 'XP Calculator', href: '/wiki/tools/xp-calculator' },
    ],
  },
]

const STORAGE_KEY = 'wiki-sidebar-expanded'

function getDefaultExpanded(pathname: string): Record<string, boolean> {
  const defaults: Record<string, boolean> = {}
  for (const section of NAV_SECTIONS) {
    const isActive = section.items.some(item => pathname.startsWith(item.href))
    defaults[section.id] = isActive
  }
  return defaults
}

interface WikiSidebarProps {
  mobileOpen: boolean
  onMobileClose: () => void
}

export default function WikiSidebar({ mobileOpen, onMobileClose }: WikiSidebarProps) {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setExpanded(JSON.parse(stored))
      } else {
        setExpanded(getDefaultExpanded(pathname))
      }
    } catch {
      setExpanded(getDefaultExpanded(pathname))
    }
  }, [pathname])

  const toggleSection = useCallback((id: string) => {
    setExpanded(prev => {
      const next = { ...prev, [id]: !prev[id] }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {}
      return next
    })
  }, [])

  const sidebarContent = (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Wiki Home link */}
      <div className="p-4 border-b border-surface-border">
        <Link
          href="/wiki"
          className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
            pathname === '/wiki'
              ? 'text-accent'
              : 'text-foreground hover:text-accent'
          }`}
          onClick={onMobileClose}
        >
          <span>📖</span>
          <span>Wiki Home</span>
        </Link>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 p-3 space-y-0.5">
        {NAV_SECTIONS.map(section => {
          const isOpen = expanded[section.id] ?? false
          const hasActive = section.items.some(item => pathname === item.href || pathname.startsWith(item.href + '/'))

          return (
            <div key={section.id}>
              <button
                onClick={() => toggleSection(section.id)}
                className={`w-full flex items-center justify-between px-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                  hasActive
                    ? 'text-foreground bg-surface-hover'
                    : 'text-foreground-secondary hover:text-foreground hover:bg-surface-hover'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{section.icon}</span>
                  <span>{section.title}</span>
                </span>
                <svg
                  className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isOpen && (
                <div className="ml-4 mt-0.5 space-y-0.5 border-l border-surface-border pl-3">
                  {section.items.map(item => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onMobileClose}
                        className={`block px-2 py-1.5 rounded-md text-sm transition-colors ${
                          isActive
                            ? 'text-accent font-medium bg-accent/10'
                            : 'text-foreground-secondary hover:text-foreground hover:bg-surface-hover'
                        }`}
                      >
                        {item.label}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-16 bottom-0 w-[260px] bg-surface border-r border-surface-border z-40">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/60 z-40"
            onClick={onMobileClose}
            aria-hidden="true"
          />
          <aside className="md:hidden fixed left-0 top-16 bottom-0 w-[280px] bg-surface border-r border-surface-border z-50 shadow-xl">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  )
}
