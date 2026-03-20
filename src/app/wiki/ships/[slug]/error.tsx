'use client'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="bg-surface border border-surface-border rounded-xl p-8 max-w-md text-center">
        <h2 className="text-xl font-bold text-foreground mb-2">Something went wrong</h2>
        <p className="text-foreground-secondary text-sm mb-4">{error.message}</p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg text-sm font-medium transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
