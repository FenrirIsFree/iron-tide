'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export interface NavBoxItem {
  label: string
  href: string
}

interface NavBoxProps {
  category: string
  icon: string
  items: NavBoxItem[]
}

export default function NavBox({ category, icon, items }: NavBoxProps) {
  const pathname = usePathname()

  return (
    <div className="mt-10 border border-surface-border rounded-xl p-4 bg-surface">
      <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-3">
        {icon} {category}
      </p>
      <div className="flex flex-wrap gap-x-1 gap-y-1">
        {items.map((item, i) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <span key={item.href} className="inline-flex items-center">
              <Link
                href={item.href}
                className={`text-sm transition-colors ${
                  isActive
                    ? 'text-accent font-semibold pointer-events-none'
                    : 'text-foreground-secondary hover:text-accent'
                }`}
              >
                {item.label}
              </Link>
              {i < items.length - 1 && (
                <span className="text-foreground-muted mx-1.5 select-none">·</span>
              )}
            </span>
          )
        })}
      </div>
    </div>
  )
}
