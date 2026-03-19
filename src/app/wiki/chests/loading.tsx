import Navbar from '@/components/Navbar'

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4 max-w-7xl mx-auto w-full animate-pulse">
        <div className="h-4 bg-surface rounded w-32 mb-6" />
        <div className="h-8 bg-surface rounded w-48 mb-2" />
        <div className="h-5 bg-surface rounded w-64 mb-6" />
        <div className="bg-surface border border-surface-border rounded-xl h-96" />
      </main>
    </div>
  )
}
