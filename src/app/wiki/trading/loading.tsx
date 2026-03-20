export default function Loading() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 max-w-5xl mx-auto animate-pulse">
      <div className="h-4 bg-surface-hover rounded w-32 mb-6" />
      <div className="h-8 bg-surface-hover rounded w-48 mb-2" />
      <div className="h-4 bg-surface-hover rounded w-64 mb-8" />
      <div className="grid gap-3 sm:grid-cols-3 mb-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-surface border border-surface-border rounded-xl p-4 h-20" />
        ))}
      </div>
      <div className="bg-surface border border-surface-border rounded-xl h-64" />
    </div>
  )
}
