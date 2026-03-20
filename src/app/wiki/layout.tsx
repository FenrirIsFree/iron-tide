import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WikiLayoutClient from './WikiLayoutClient'

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
