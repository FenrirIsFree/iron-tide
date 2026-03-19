import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Fleet — The Iron Tide",
  description: "Manage your ships, loadouts, and weapons.",
}

import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { getUserFleet, getShipCatalog, getWeaponCatalog, getUpgradeCatalog, getAmmoCatalog, getCrewCatalog, getConsumableCatalog } from '@/app/actions/fleet'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FleetClient from './FleetClient'
import { serialize } from '@/lib/serialize'

export default async function FleetPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [fleet, ships, weapons, upgrades, ammo, crew, consumables] = await Promise.all([
    getUserFleet(),
    getShipCatalog(),
    getWeaponCatalog(),
    getUpgradeCatalog(),
    getAmmoCatalog(),
    getCrewCatalog(),
    getConsumableCatalog(),
  ])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4 max-w-7xl mx-auto w-full">
        <FleetClient
          initialFleet={serialize(fleet)}
          shipCatalog={serialize(ships)}
          weaponCatalog={serialize(weapons)}
          upgradeCatalog={serialize(upgrades)}
          ammoCatalog={serialize(ammo)}
          crewCatalog={serialize(crew)}
          consumableCatalog={serialize(consumables)}
        />
      </main>
      <Footer />
    </div>
  )
}
