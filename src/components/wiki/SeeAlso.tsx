import Link from 'next/link'

export interface SeeAlsoItem {
  title: string
  href: string
  description?: string
}

interface SeeAlsoProps {
  items: SeeAlsoItem[]
}

export default function SeeAlso({ items }: SeeAlsoProps) {
  return (
    <section className="mt-12 pt-8 border-t border-surface-border">
      <h2 className="text-lg font-semibold text-foreground mb-4">📌 See Also</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col gap-1 bg-surface border border-surface-border rounded-lg p-3 hover:border-accent hover:bg-surface-hover transition-colors group"
          >
            <span className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
              {item.title}
            </span>
            {item.description && (
              <span className="text-xs text-foreground-muted leading-relaxed">
                {item.description}
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  )
}
