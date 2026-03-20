export default function Loading() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 max-w-5xl mx-auto animate-pulse">
      <div className="h-4 bg-surface-hover rounded w-32 mb-6" />
      <div className="h-8 bg-surface-hover rounded w-56 mb-2" />
      <div className="h-4 bg-surface-hover rounded w-80 mb-8" />
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="bg-surface border border-surface-border rounded-xl p-4 h-32" />
        ))}
      </div>
    </div>
  )
}
