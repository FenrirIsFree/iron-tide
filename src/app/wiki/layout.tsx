import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WikiLayoutClient from './WikiLayoutClient'

export const metadata: Metadata = {
  openGraph: {
    siteName: 'The Iron Tide',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
  },
}

export default function WikiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background">
      <Navbar />
      <WikiLayoutClient>
        {children}
        <Footer />
      </WikiLayoutClient>
    </div>
  )
}
