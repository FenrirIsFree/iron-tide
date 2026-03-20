export default function Loading() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 max-w-5xl mx-auto animate-pulse">
      <div className="h-4 bg-surface-hover rounded w-32 mb-6" />
      <div className="h-8 bg-surface-hover rounded w-48 mb-2" />
      <div className="h-4 bg-surface-hover rounded w-80 mb-8" />
      <div className="flex gap-8">
        <div className="w-52 shrink-0 hidden lg:block space-y-2">
          {Array.from({ length: 11 }).map((_, i) => (
            <div key={i} className="h-8 bg-surface-hover rounded" />
          ))}
        </div>
        <div className="flex-1 space-y-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-6 bg-surface-hover rounded w-48" />
              <div className="h-4 bg-surface-hover rounded w-full" />
              <div className="h-4 bg-surface-hover rounded w-3/4" />
              <div className="h-20 bg-surface-hover rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
