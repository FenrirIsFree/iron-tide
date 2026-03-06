import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { getUserFleet, getShipCatalog, getWeaponCatalog, getUpgradeCatalog, getAmmoCatalog, getCrewCatalog } from '@/app/actions/fleet'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FleetClient from './FleetClient'

export default async function FleetPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [fleet, ships, weapons, upgrades, ammo, crew] = await Promise.all([
    getUserFleet(),
    getShipCatalog(),
    getWeaponCatalog(),
    getUpgradeCatalog(),
    getAmmoCatalog(),
    getCrewCatalog(),
  ])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4 max-w-7xl mx-auto w-full">
        <FleetClient
          initialFleet={JSON.parse(JSON.stringify(fleet))}
          shipCatalog={JSON.parse(JSON.stringify(ships))}
          weaponCatalog={JSON.parse(JSON.stringify(weapons))}
          upgradeCatalog={JSON.parse(JSON.stringify(upgrades))}
          ammoCatalog={JSON.parse(JSON.stringify(ammo))}
          crewCatalog={JSON.parse(JSON.stringify(crew))}
        />
      </main>
      <Footer />
    </div>
  )
}
