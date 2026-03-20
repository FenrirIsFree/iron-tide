import Link from 'next/link'

interface WikiBreadcrumbProps {
  current: string
  parent?: { label: string; href: string }
}

export default function WikiBreadcrumb({ current, parent }: WikiBreadcrumbProps) {
  return (
    <nav className="text-sm mb-4">
      <Link href="/wiki" className="text-foreground-muted hover:text-accent transition-colors">
        📖 Wiki
      </Link>
      {parent && (
        <>
          <span className="text-foreground-muted mx-2">›</span>
          <Link href={parent.href} className="text-foreground-muted hover:text-accent transition-colors">
            {parent.label}
          </Link>
        </>
      )}
      <span className="text-foreground-muted mx-2">›</span>
      <span className="text-foreground-secondary">{current}</span>
    </nav>
  )
}
