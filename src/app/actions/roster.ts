'use server'

import { createServerSupabaseClient } from '@/lib/supabase-server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { updateRankSchema, uuidSchema } from '@/lib/validation'

const rankOrder: Record<string, number> = {
  FOUNDER: 0,
  ADMIRAL: 1,
  COMMODORE: 2,
  OFFICER: 3,
  MIDSHIPMAN: 4,
  SAILOR: 5,
  CABIN_BOY: 6,
}

const RANKS = ['FOUNDER', 'ADMIRAL', 'COMMODORE', 'OFFICER', 'MIDSHIPMAN', 'SAILOR', 'CABIN_BOY'] as const
type GuildRank = typeof RANKS[number]

export async function updateMemberRank(targetUserId: string, newRank: string) {
  const parsed = updateRankSchema.safeParse({ targetUserId, newRank })
  if (!parsed.success) throw new Error('Invalid input')
  // Auth check
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const currentUser = await prisma.user.findUnique({ where: { supabaseId: user.id } })
  if (!currentUser) throw new Error('User not found')

  const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } })
  if (!targetUser) throw new Error('Target user not found')

  // Validate rank
  if (!RANKS.includes(newRank as GuildRank)) throw new Error('Invalid rank')

  const myRankLevel = rankOrder[currentUser.rank] ?? 99
  const targetCurrentLevel = rankOrder[targetUser.rank] ?? 99
  const newRankLevel = rankOrder[newRank] ?? 99

  // Can't change your own rank
  if (currentUser.id === targetUserId) throw new Error("Can't change your own rank")

  // Must outrank the target (lower number = higher rank)
  if (myRankLevel >= targetCurrentLevel) throw new Error('You can only manage members below your rank')

  // Can't promote someone to your rank or above
  if (newRankLevel <= myRankLevel) throw new Error("Can't promote someone to your rank or above")

  // Only Founder can set Admiral
  if (newRank === 'ADMIRAL' && currentUser.rank !== 'FOUNDER') throw new Error('Only the Founder can appoint Admirals')

  await prisma.user.update({
    where: { id: targetUserId },
    data: { rank: newRank as GuildRank },
  })

  revalidatePath('/roster')
}

export async function getMembers() {
  const members = await prisma.user.findMany({
    where: { isPublic: true },
    select: {
      id: true,
      username: true,
      inGameName: true,
      rank: true,
      joinedAt: true,
    },
  })
  return members.sort((a, b) => {
    const rd = (rankOrder[a.rank] ?? 99) - (rankOrder[b.rank] ?? 99)
    if (rd !== 0) return rd
    return new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime()
  })
}

export async function getMemberFleet(userId: string) {
  uuidSchema.parse(userId)
  return prisma.userShip.findMany({
    where: { userId, isPublic: true },
    include: {
      ship: true,
      loadouts: {
        where: { isActive: true },
        take: 1,
        include: {
          weapons: { include: { weapon: true } },
          upgrades: { include: { upgrade: true } },
          ammo: { include: { ammoType: true } },
          crew: { include: { crewType: true } },
          consumables: { include: { consumable: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}
