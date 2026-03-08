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

export async function getUserInventory() {
  const user = await getCurrentUser()

  // Get all catalog items
  const [allResources, allConsumables, allCurrencies, allAmmo] = await Promise.all([
    prisma.resource.findMany({ orderBy: { name: 'asc' } }),
    prisma.consumable.findMany({ orderBy: { name: 'asc' } }),
    prisma.currency.findMany({ orderBy: { name: 'asc' } }),
    prisma.ammoType.findMany({ orderBy: { name: 'asc' } }),
  ])

  // Get user's existing inventory entries
  const [userResources, userConsumables, userCurrencies, userAmmo] = await Promise.all([
    prisma.userResource.findMany({ where: { userId: user.id }, include: { resource: true } }),
    prisma.userConsumable.findMany({ where: { userId: user.id }, include: { consumable: true } }),
    prisma.userCurrency.findMany({ where: { userId: user.id }, include: { currency: true } }),
    prisma.userAmmo.findMany({ where: { userId: user.id }, include: { ammoType: true } }),
  ])

  // Create lookup maps
  const resMap = new Map(userResources.map(r => [r.resourceId, r]))
  const conMap = new Map(userConsumables.map(c => [c.consumableId, c]))
  const curMap = new Map(userCurrencies.map(c => [c.currencyId, c]))
  const ammoMap = new Map(userAmmo.map(a => [a.ammoTypeId, a]))

  // Auto-create missing entries (quantity 0) so all items show up
  const resCreates = allResources.filter(r => !resMap.has(r.id)).map(r =>
    prisma.userResource.create({ data: { userId: user.id, resourceId: r.id, quantity: 0 }, include: { resource: true } })
  )
  const conCreates = allConsumables.filter(c => !conMap.has(c.id)).map(c =>
    prisma.userConsumable.create({ data: { userId: user.id, consumableId: c.id, quantity: 0 }, include: { consumable: true } })
  )
  const curCreates = allCurrencies.filter(c => !curMap.has(c.id)).map(c =>
    prisma.userCurrency.create({ data: { userId: user.id, currencyId: c.id, amount: 0 }, include: { currency: true } })
  )
  const ammoCreates = allAmmo.filter(a => !ammoMap.has(a.id)).map(a =>
    prisma.userAmmo.create({ data: { userId: user.id, ammoTypeId: a.id, quantity: 0 }, include: { ammoType: true } })
  )

  const [newRes, newCon, newCur, newAmmo] = await Promise.all([
    Promise.all(resCreates),
    Promise.all(conCreates),
    Promise.all(curCreates),
    Promise.all(ammoCreates),
  ])

  // Merge and sort
  const resources = [...userResources, ...newRes].sort((a, b) => a.resource.name.localeCompare(b.resource.name))
  const consumables = [...userConsumables, ...newCon].sort((a, b) => a.consumable.name.localeCompare(b.consumable.name))
  const currencies = [...userCurrencies, ...newCur].sort((a, b) => a.currency.name.localeCompare(b.currency.name))
  const ammo = [...userAmmo, ...newAmmo].sort((a, b) => a.ammoType.name.localeCompare(b.ammoType.name))

  return { resources, consumables, currencies, ammo }
}

export async function getCatalogs() {
  const [resources, consumables, currencies, ammo] = await Promise.all([
    prisma.resource.findMany({ orderBy: { name: 'asc' } }),
    prisma.consumable.findMany({ orderBy: { name: 'asc' } }),
    prisma.currency.findMany({ orderBy: { name: 'asc' } }),
    prisma.ammoType.findMany({ orderBy: { name: 'asc' } }),
  ])
  return { resources, consumables, currencies, ammo }
}

export async function updateResource(resourceId: string, quantity: number) {
  const user = await getCurrentUser()
  await prisma.userResource.upsert({
    where: { userId_resourceId: { userId: user.id, resourceId } },
    update: { quantity },
    create: { userId: user.id, resourceId, quantity },
  })
  revalidatePath('/inventory')
}

export async function updateConsumable(consumableId: string, quantity: number) {
  const user = await getCurrentUser()
  await prisma.userConsumable.upsert({
    where: { userId_consumableId: { userId: user.id, consumableId } },
    update: { quantity },
    create: { userId: user.id, consumableId, quantity },
  })
  revalidatePath('/inventory')
}

export async function updateCurrency(currencyId: string, amount: number) {
  const user = await getCurrentUser()
  await prisma.userCurrency.upsert({
    where: { userId_currencyId: { userId: user.id, currencyId } },
    update: { amount },
    create: { userId: user.id, currencyId, amount },
  })
  revalidatePath('/inventory')
}

export async function updateAmmo(ammoTypeId: string, quantity: number) {
  const user = await getCurrentUser()
  await prisma.userAmmo.upsert({
    where: { userId_ammoTypeId: { userId: user.id, ammoTypeId } },
    update: { quantity },
    create: { userId: user.id, ammoTypeId, quantity },
  })
  revalidatePath('/inventory')
}

export async function toggleItemVisibility(type: 'resource' | 'consumable' | 'currency' | 'ammo', itemId: string) {
  const user = await getCurrentUser()
  if (type === 'resource') {
    const item = await prisma.userResource.findFirst({ where: { id: itemId, userId: user.id } })
    if (!item) throw new Error('Item not found')
    await prisma.userResource.update({ where: { id: itemId }, data: { isPublic: !item.isPublic } })
  } else if (type === 'consumable') {
    const item = await prisma.userConsumable.findFirst({ where: { id: itemId, userId: user.id } })
    if (!item) throw new Error('Item not found')
    await prisma.userConsumable.update({ where: { id: itemId }, data: { isPublic: !item.isPublic } })
  } else if (type === 'ammo') {
    const item = await prisma.userAmmo.findFirst({ where: { id: itemId, userId: user.id } })
    if (!item) throw new Error('Item not found')
    await prisma.userAmmo.update({ where: { id: itemId }, data: { isPublic: !item.isPublic } })
  } else {
    const item = await prisma.userCurrency.findFirst({ where: { id: itemId, userId: user.id } })
    if (!item) throw new Error('Item not found')
    await prisma.userCurrency.update({ where: { id: itemId }, data: { isPublic: !item.isPublic } })
  }
  revalidatePath('/inventory')
}
