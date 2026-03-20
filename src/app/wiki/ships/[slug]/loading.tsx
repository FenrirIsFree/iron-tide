export default function Loading() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 max-w-5xl mx-auto">
      <div className="animate-pulse space-y-8">
        {/* Breadcrumb */}
        <div className="h-4 bg-surface-hover rounded w-48" />

        {/* Header */}
        <div className="space-y-3">
          <div className="h-8 bg-surface-hover rounded w-64" />
          <div className="h-4 bg-surface-hover rounded w-96" />
          <div className="h-16 bg-surface-hover rounded w-full max-w-2xl" />
        </div>

        {/* Stats grid */}
        <div>
          <div className="h-5 bg-surface-hover rounded w-32 mb-4" />
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-surface border border-surface-border rounded-xl p-4 h-24" />
            ))}
          </div>
        </div>

        {/* Weapon loadout */}
        <div>
          <div className="h-5 bg-surface-hover rounded w-40 mb-4" />
          <div className="bg-surface border border-surface-border rounded-xl p-5 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-3 bg-surface-hover rounded-full" />
            ))}
          </div>
        </div>

        {/* Acquisition */}
        <div>
          <div className="h-5 bg-surface-hover rounded w-32 mb-4" />
          <div className="bg-surface border border-surface-border rounded-xl p-5 h-32" />
        </div>
      </div>
    </div>
  )
}
