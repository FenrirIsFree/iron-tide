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

function requireLeadership(rank: string) {
  if (rank !== 'FOUNDER' && rank !== 'ADMIRAL') throw new Error('Insufficient rank')
}

const squadronInclude = {
  createdBy: { select: { id: true, username: true, rank: true } },
  slots: {
    orderBy: { position: 'asc' as const },
    include: {
      userShip: {
        include: {
          user: { select: { id: true, username: true } },
          ship: true,
          loadouts: {
            where: { isActive: true },
            take: 1,
            include: {
              weapons: { include: { weapon: true } },
              upgrades: { include: { upgrade: true } },
              crew: { include: { crewType: true } },
            },
          },
        },
      },
    },
  },
}

export async function getSquadrons() {
  return prisma.squadron.findMany({
    orderBy: { createdAt: 'desc' },
    include: squadronInclude,
  })
}

export async function getGuildFleet() {
  const currentUser = await getCurrentUser()
  requireLeadership(currentUser.rank)

  return prisma.userShip.findMany({
    where: { isPublic: true },
    include: {
      user: { select: { id: true, username: true } },
      ship: true,
      loadouts: {
        where: { isActive: true },
        take: 1,
        include: {
          weapons: { include: { weapon: true } },
          upgrades: { include: { upgrade: true } },
          crew: { include: { crewType: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function createSquadron(name: string) {
  const currentUser = await getCurrentUser()
  requireLeadership(currentUser.rank)

  await prisma.squadron.create({
    data: { name: name || 'New Squadron', createdById: currentUser.id },
  })
  revalidatePath('/squadrons')
}

export async function renameSquadron(squadronId: string, name: string) {
  const currentUser = await getCurrentUser()
  const squadron = await prisma.squadron.findUnique({ where: { id: squadronId } })
  if (!squadron) throw new Error('Squadron not found')
  if (squadron.createdById !== currentUser.id) throw new Error('Only the creator can rename')

  await prisma.squadron.update({ where: { id: squadronId }, data: { name } })
  revalidatePath('/squadrons')
}

export async function deleteSquadron(squadronId: string) {
  const currentUser = await getCurrentUser()
  const squadron = await prisma.squadron.findUnique({ where: { id: squadronId } })
  if (!squadron) throw new Error('Squadron not found')
  if (squadron.createdById !== currentUser.id) throw new Error('Only the creator can delete')

  await prisma.squadron.delete({ where: { id: squadronId } })
  revalidatePath('/squadrons')
}

export async function addShipToSquadron(squadronId: string, userShipId: string) {
  const currentUser = await getCurrentUser()
  requireLeadership(currentUser.rank)
  const squadron = await prisma.squadron.findUnique({ where: { id: squadronId }, include: { slots: true } })
  if (!squadron) throw new Error('Squadron not found')
  if (squadron.createdById !== currentUser.id) throw new Error('Only the creator can add ships')

  const maxPos = squadron.slots.reduce((max, s) => Math.max(max, s.position), -1)
  await prisma.squadronSlot.create({
    data: { squadronId, userShipId, position: maxPos + 1 },
  })
  revalidatePath('/squadrons')
}

export async function removeShipFromSquadron(squadronId: string, userShipId: string) {
  const currentUser = await getCurrentUser()
  requireLeadership(currentUser.rank)
  const squadron = await prisma.squadron.findUnique({ where: { id: squadronId } })
  if (!squadron) throw new Error('Squadron not found')
  if (squadron.createdById !== currentUser.id) throw new Error('Only the creator can remove ships')

  await prisma.squadronSlot.delete({
    where: { squadronId_userShipId: { squadronId, userShipId } },
  })
  revalidatePath('/squadrons')
}

export async function reorderSquadronSlots(squadronId: string, slotIds: string[]) {
  const currentUser = await getCurrentUser()
  const squadron = await prisma.squadron.findUnique({ where: { id: squadronId } })
  if (!squadron) throw new Error('Squadron not found')
  if (squadron.createdById !== currentUser.id) throw new Error('Only the creator can reorder')

  await prisma.$transaction(
    slotIds.map((id, index) =>
      prisma.squadronSlot.update({ where: { id }, data: { position: index } })
    )
  )
  revalidatePath('/squadrons')
}
