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
  const [resources, consumables, currencies] = await Promise.all([
    prisma.userResource.findMany({
      where: { userId: user.id },
      include: { resource: true },
      orderBy: { resource: { name: 'asc' } },
    }),
    prisma.userConsumable.findMany({
      where: { userId: user.id },
      include: { consumable: true },
      orderBy: { consumable: { name: 'asc' } },
    }),
    prisma.userCurrency.findMany({
      where: { userId: user.id },
      include: { currency: true },
      orderBy: { currency: { name: 'asc' } },
    }),
  ])
  return { resources, consumables, currencies }
}

export async function getCatalogs() {
  const [resources, consumables, currencies] = await Promise.all([
    prisma.resource.findMany({ orderBy: { name: 'asc' } }),
    prisma.consumable.findMany({ orderBy: { name: 'asc' } }),
    prisma.currency.findMany({ orderBy: { name: 'asc' } }),
  ])
  return { resources, consumables, currencies }
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

export async function toggleItemVisibility(type: 'resource' | 'consumable' | 'currency', itemId: string) {
  const user = await getCurrentUser()
  if (type === 'resource') {
    const item = await prisma.userResource.findFirst({ where: { id: itemId, userId: user.id } })
    if (!item) throw new Error('Item not found')
    await prisma.userResource.update({ where: { id: itemId }, data: { isPublic: !item.isPublic } })
  } else if (type === 'consumable') {
    const item = await prisma.userConsumable.findFirst({ where: { id: itemId, userId: user.id } })
    if (!item) throw new Error('Item not found')
    await prisma.userConsumable.update({ where: { id: itemId }, data: { isPublic: !item.isPublic } })
  } else {
    const item = await prisma.userCurrency.findFirst({ where: { id: itemId, userId: user.id } })
    if (!item) throw new Error('Item not found')
    await prisma.userCurrency.update({ where: { id: itemId }, data: { isPublic: !item.isPublic } })
  }
  revalidatePath('/inventory')
}
