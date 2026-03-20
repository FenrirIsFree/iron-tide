import Link from 'next/link'

interface WikiLinkProps {
  href: string
  children: React.ReactNode
}

/**
 * Styled inline link for wiki cross-references.
 * Use for the first mention of a game term in body text.
 */
export default function WikiLink({ href, children }: WikiLinkProps) {
  return (
    <Link
      href={href}
      className="text-accent hover:text-accent-hover underline underline-offset-2 decoration-accent/50 hover:decoration-accent transition-colors"
    >
      {children}
    </Link>
  )
}
