'use client'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-4">💀</div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Something went wrong</h1>
        <p className="text-foreground-secondary mb-6">
          {error.message || 'An unexpected error occurred. The seas are rough today.'}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary-hover transition-colors"
          >
            Try again
          </button>
          <a
            href="/"
            className="px-6 py-2 text-sm font-medium text-accent border border-accent rounded-lg hover:bg-accent hover:text-background transition-colors"
          >
            Return home
          </a>
        </div>
      </div>
    </div>
  )
}
