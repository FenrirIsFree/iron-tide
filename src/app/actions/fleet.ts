'use server'

import { createServerSupabaseClient } from '@/lib/supabase-server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

async function getCurrentUser() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } })
  if (!dbUser) throw new Error('User not found')
  return dbUser
}

const loadoutInclude = {
  weapons: { include: { weapon: true } },
  upgrades: { include: { upgrade: true } },
  ammo: { include: { ammoType: true } },
  crew: { include: { crewType: true } },
  consumables: { include: { consumable: true } },
}

export async function getUserFleet() {
  const user = await getCurrentUser()
  return prisma.userShip.findMany({
    where: { userId: user.id },
    include: {
      ship: true,
      loadouts: {
        include: loadoutInclude,
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getShipCatalog() {
  return prisma.ship.findMany({ orderBy: [{ rate: 'asc' }, { name: 'asc' }] })
}

export async function getWeaponCatalog() {
  return prisma.weapon.findMany({ orderBy: { name: 'asc' } })
}

export async function getUpgradeCatalog() {
  return prisma.upgrade.findMany({ orderBy: { name: 'asc' } })
}

export async function getAmmoCatalog() {
  return prisma.ammoType.findMany({ orderBy: { name: 'asc' } })
}

export async function getCrewCatalog() {
  return prisma.crewType.findMany({ orderBy: { name: 'asc' } })
}

// ============================================================
// SHIP MANAGEMENT
// ============================================================

export async function addShip(shipId: string, nickname?: string) {
  const user = await getCurrentUser()
  await prisma.userShip.create({
    data: {
      userId: user.id,
      shipId,
      nickname: nickname || null,
      loadouts: {
        create: { name: 'Loadout 1', isActive: true },
      },
    },
  })
  revalidatePath('/fleet')
}

export async function removeShip(userShipId: string) {
  const user = await getCurrentUser()
  await prisma.userShip.deleteMany({ where: { id: userShipId, userId: user.id } })
  revalidatePath('/fleet')
}

export async function updateShipNickname(userShipId: string, nickname: string) {
  const user = await getCurrentUser()
  await prisma.userShip.updateMany({
    where: { id: userShipId, userId: user.id },
    data: { nickname: nickname || null },
  })
  revalidatePath('/fleet')
}

export async function toggleShipVisibility(userShipId: string) {
  const user = await getCurrentUser()
  const ship = await prisma.userShip.findFirst({ where: { id: userShipId, userId: user.id } })
  if (!ship) throw new Error('Ship not found')
  await prisma.userShip.update({
    where: { id: userShipId },
    data: { isPublic: !ship.isPublic },
  })
  revalidatePath('/fleet')
}

// ============================================================
// LOADOUT MANAGEMENT
// ============================================================

export async function addLoadout(userShipId: string, name?: string) {
  const user = await getCurrentUser()
  const ship = await prisma.userShip.findFirst({
    where: { id: userShipId, userId: user.id },
    include: { loadouts: true },
  })
  if (!ship) throw new Error('Ship not found')
  if (ship.loadouts.length >= 3) throw new Error('Maximum 3 loadouts per ship')
  await prisma.loadout.create({
    data: { userShipId, name: name || `Loadout ${ship.loadouts.length + 1}` },
  })
  revalidatePath('/fleet')
}

export async function removeLoadout(loadoutId: string) {
  const user = await getCurrentUser()
  const loadout = await prisma.loadout.findUnique({
    where: { id: loadoutId },
    include: { userShip: { include: { loadouts: true } } },
  })
  if (!loadout) throw new Error('Loadout not found')
  if (loadout.userShip.loadouts.length <= 1) throw new Error('Cannot remove last loadout')
  if (loadout.isActive) throw new Error('Cannot remove active loadout')
  // Verify ownership
  const ship = await prisma.userShip.findFirst({ where: { id: loadout.userShipId, userId: user.id } })
  if (!ship) throw new Error('Not authorized')
  await prisma.loadout.delete({ where: { id: loadoutId } })
  revalidatePath('/fleet')
}

export async function setActiveLoadout(loadoutId: string) {
  const user = await getCurrentUser()
  const loadout = await prisma.loadout.findUnique({ where: { id: loadoutId }, include: { userShip: true } })
  if (!loadout) throw new Error('Loadout not found')
  const ship = await prisma.userShip.findFirst({ where: { id: loadout.userShipId, userId: user.id } })
  if (!ship) throw new Error('Not authorized')
  // Deactivate all, activate this one
  await prisma.loadout.updateMany({ where: { userShipId: loadout.userShipId }, data: { isActive: false } })
  await prisma.loadout.update({ where: { id: loadoutId }, data: { isActive: true } })
  revalidatePath('/fleet')
}

export async function renameLoadout(loadoutId: string, name: string) {
  const user = await getCurrentUser()
  const loadout = await prisma.loadout.findUnique({ where: { id: loadoutId }, include: { userShip: true } })
  if (!loadout) throw new Error('Loadout not found')
  const ship = await prisma.userShip.findFirst({ where: { id: loadout.userShipId, userId: user.id } })
  if (!ship) throw new Error('Not authorized')
  await prisma.loadout.update({ where: { id: loadoutId }, data: { name } })
  revalidatePath('/fleet')
}

// ============================================================
// LOADOUT WEAPONS
// ============================================================

export async function addWeaponToLoadout(loadoutId: string, weaponId: string, position: string, quantity: number = 1) {
  const user = await getCurrentUser()
  const loadout = await prisma.loadout.findUnique({ where: { id: loadoutId }, include: { userShip: true } })
  if (!loadout) throw new Error('Loadout not found')
  const ship = await prisma.userShip.findFirst({ where: { id: loadout.userShipId, userId: user.id } })
  if (!ship) throw new Error('Not authorized')

  await prisma.loadoutWeapon.create({ data: { loadoutId, weaponId, position, quantity } })
  revalidatePath('/fleet')
}

export async function removeWeaponFromLoadout(loadoutWeaponId: string) {
  await getCurrentUser()
  await prisma.loadoutWeapon.delete({ where: { id: loadoutWeaponId } })
  revalidatePath('/fleet')
}

// ============================================================
// LOADOUT UPGRADES
// ============================================================

export async function addUpgradeToLoadout(loadoutId: string, upgradeId: string) {
  const user = await getCurrentUser()
  const loadout = await prisma.loadout.findUnique({ where: { id: loadoutId }, include: { userShip: true } })
  if (!loadout) throw new Error('Loadout not found')
  const ship = await prisma.userShip.findFirst({ where: { id: loadout.userShipId, userId: user.id } })
  if (!ship) throw new Error('Not authorized')
  await prisma.loadoutUpgrade.create({ data: { loadoutId, upgradeId } })
  revalidatePath('/fleet')
}

export async function removeUpgradeFromLoadout(loadoutUpgradeId: string) {
  await getCurrentUser()
  await prisma.loadoutUpgrade.delete({ where: { id: loadoutUpgradeId } })
  revalidatePath('/fleet')
}

// ============================================================
// LOADOUT AMMO
// ============================================================

export async function addAmmoToLoadout(loadoutId: string, ammoTypeId: string, quantity: number) {
  const user = await getCurrentUser()
  const loadout = await prisma.loadout.findUnique({ where: { id: loadoutId }, include: { userShip: true } })
  if (!loadout) throw new Error('Loadout not found')
  const ship = await prisma.userShip.findFirst({ where: { id: loadout.userShipId, userId: user.id } })
  if (!ship) throw new Error('Not authorized')
  await prisma.loadoutAmmo.create({ data: { loadoutId, ammoTypeId, quantity } })
  revalidatePath('/fleet')
}

export async function removeAmmoFromLoadout(loadoutAmmoId: string) {
  await getCurrentUser()
  await prisma.loadoutAmmo.delete({ where: { id: loadoutAmmoId } })
  revalidatePath('/fleet')
}

// ============================================================
// LOADOUT CREW
// ============================================================

export async function addCrewToLoadout(loadoutId: string, crewTypeId: string, quantity: number) {
  const user = await getCurrentUser()
  const loadout = await prisma.loadout.findUnique({ where: { id: loadoutId }, include: { userShip: true } })
  if (!loadout) throw new Error('Loadout not found')
  const ship = await prisma.userShip.findFirst({ where: { id: loadout.userShipId, userId: user.id } })
  if (!ship) throw new Error('Not authorized')
  await prisma.loadoutCrew.create({ data: { loadoutId, crewTypeId, quantity } })
  revalidatePath('/fleet')
}

export async function removeCrewFromLoadout(loadoutCrewId: string) {
  await getCurrentUser()
  await prisma.loadoutCrew.delete({ where: { id: loadoutCrewId } })
  revalidatePath('/fleet')
}

export async function updateCrewQuantity(loadoutCrewId: string, quantity: number) {
  await getCurrentUser()
  await prisma.loadoutCrew.update({ where: { id: loadoutCrewId }, data: { quantity } })
  revalidatePath('/fleet')
}

// ============================================================
// LOADOUT CONSUMABLES
// ============================================================

export async function getConsumableCatalog() {
  return prisma.consumable.findMany({ orderBy: { name: 'asc' } })
}

export async function addConsumableToLoadout(loadoutId: string, consumableId: string, quantity: number) {
  const user = await getCurrentUser()
  const loadout = await prisma.loadout.findUnique({ where: { id: loadoutId }, include: { userShip: true } })
  if (!loadout) throw new Error('Loadout not found')
  const ship = await prisma.userShip.findFirst({ where: { id: loadout.userShipId, userId: user.id } })
  if (!ship) throw new Error('Not authorized')
  await prisma.loadoutConsumable.create({ data: { loadoutId, consumableId, quantity: Math.min(200, Math.max(1, quantity)) } })
  revalidatePath('/fleet')
}

export async function removeConsumableFromLoadout(loadoutConsumableId: string) {
  await getCurrentUser()
  await prisma.loadoutConsumable.delete({ where: { id: loadoutConsumableId } })
  revalidatePath('/fleet')
}
