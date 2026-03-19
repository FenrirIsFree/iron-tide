import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">🏴‍☠️</div>
          <h1 className="text-4xl font-bold text-accent mb-2">404</h1>
          <p className="text-xl text-foreground mb-2">Lost at sea</p>
          <p className="text-foreground-secondary mb-8">
            This page has sunk to the depths. There&apos;s nothing here, captain.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/"
              className="px-6 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary-hover transition-colors"
            >
              Return to port
            </Link>
            <Link
              href="/wiki"
              className="px-6 py-2 text-sm font-medium text-accent border border-accent rounded-lg hover:bg-accent hover:text-background transition-colors"
            >
              Browse the wiki
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
