'use server'

import prisma from '@/lib/prisma'

const rankOrder: Record<string, number> = {
  FOUNDER: 0,
  ADMIRAL: 1,
  COMMODORE: 2,
  OFFICER: 3,
  MIDSHIPMAN: 4,
  SAILOR: 5,
  CABIN_BOY: 6,
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
