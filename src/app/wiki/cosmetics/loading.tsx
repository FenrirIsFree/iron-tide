export default function Loading() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 max-w-5xl mx-auto animate-pulse">
      <div className="h-4 bg-surface-hover rounded w-32 mb-6" />
      <div className="h-8 bg-surface-hover rounded w-48 mb-2" />
      <div className="h-4 bg-surface-hover rounded w-64 mb-8" />
      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="bg-surface border border-surface-border rounded-lg p-3 h-16" />
        ))}
      </div>
    </div>
  )
}
