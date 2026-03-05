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

export async function getUserFleet() {
  const user = await getCurrentUser()
  return prisma.userShip.findMany({
    where: { userId: user.id },
    include: {
      ship: true,
      weapons: { include: { weapon: true } },
      upgrades: { include: { upgrade: true } },
      ammo: { include: { ammoType: true } },
      crew: { include: { crewType: true } },
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

export async function addShip(shipId: string, nickname?: string) {
  const user = await getCurrentUser()
  await prisma.userShip.create({
    data: { userId: user.id, shipId, nickname: nickname || null },
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

export async function addWeaponToShip(userShipId: string, weaponId: string, quantity: number) {
  const user = await getCurrentUser()
  const ship = await prisma.userShip.findFirst({ where: { id: userShipId, userId: user.id } })
  if (!ship) throw new Error('Ship not found')
  await prisma.userShipWeapon.create({
    data: { userShipId, weaponId, quantity },
  })
  revalidatePath('/fleet')
}

export async function removeWeaponFromShip(userShipWeaponId: string) {
  await getCurrentUser()
  await prisma.userShipWeapon.delete({ where: { id: userShipWeaponId } })
  revalidatePath('/fleet')
}

export async function addUpgradeToShip(userShipId: string, upgradeId: string) {
  const user = await getCurrentUser()
  const ship = await prisma.userShip.findFirst({ where: { id: userShipId, userId: user.id } })
  if (!ship) throw new Error('Ship not found')
  await prisma.userShipUpgrade.create({
    data: { userShipId, upgradeId },
  })
  revalidatePath('/fleet')
}

export async function removeUpgradeFromShip(userShipUpgradeId: string) {
  await getCurrentUser()
  await prisma.userShipUpgrade.delete({ where: { id: userShipUpgradeId } })
  revalidatePath('/fleet')
}

export async function addAmmoToShip(userShipId: string, ammoTypeId: string, quantity: number) {
  const user = await getCurrentUser()
  const ship = await prisma.userShip.findFirst({ where: { id: userShipId, userId: user.id } })
  if (!ship) throw new Error('Ship not found')
  await prisma.userShipAmmo.create({
    data: { userShipId, ammoTypeId, quantity },
  })
  revalidatePath('/fleet')
}

export async function removeAmmoFromShip(userShipAmmoId: string) {
  await getCurrentUser()
  await prisma.userShipAmmo.delete({ where: { id: userShipAmmoId } })
  revalidatePath('/fleet')
}

export async function addCrewToShip(userShipId: string, crewTypeId: string, quantity: number) {
  const user = await getCurrentUser()
  const ship = await prisma.userShip.findFirst({ where: { id: userShipId, userId: user.id } })
  if (!ship) throw new Error('Ship not found')
  await prisma.userShipCrew.create({
    data: { userShipId, crewTypeId, quantity },
  })
  revalidatePath('/fleet')
}

export async function removeCrewFromShip(userShipCrewId: string) {
  await getCurrentUser()
  await prisma.userShipCrew.delete({ where: { id: userShipCrewId } })
  revalidatePath('/fleet')
}
