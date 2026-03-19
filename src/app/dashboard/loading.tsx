import Navbar from '@/components/Navbar'

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4 max-w-7xl mx-auto w-full animate-pulse">
        <div className="h-8 bg-surface rounded w-48 mb-2" />
        <div className="h-5 bg-surface rounded w-64 mb-8" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-surface border border-surface-border rounded-xl p-6 h-32" />
          ))}
        </div>
      </main>
    </div>
  )
}
