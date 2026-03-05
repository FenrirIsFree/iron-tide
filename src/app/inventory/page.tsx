import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { getUserInventory, getCatalogs } from '@/app/actions/inventory'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import InventoryClient from './InventoryClient'

export default async function InventoryPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [inventory, catalogs] = await Promise.all([getUserInventory(), getCatalogs()])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4 max-w-6xl mx-auto w-full">
        <InventoryClient
          inventory={JSON.parse(JSON.stringify(inventory))}
          catalogs={JSON.parse(JSON.stringify(catalogs))}
        />
      </main>
      <Footer />
    </div>
  )
}
