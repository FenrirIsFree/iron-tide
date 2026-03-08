import Link from 'next/link'

export default function WikiBreadcrumb({ current }: { current: string }) {
  return (
    <nav className="text-sm mb-4">
      <Link href="/wiki" className="text-foreground-muted hover:text-accent transition-colors">
        📖 Wiki
      </Link>
      <span className="text-foreground-muted mx-2">›</span>
      <span className="text-foreground-secondary">{current}</span>
    </nav>
  )
}
