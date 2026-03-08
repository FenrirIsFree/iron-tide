import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '.prisma/client'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient; pool: Pool }

if (!globalForPrisma.pool) {
  globalForPrisma.pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
    max: 5,
  })
}

const prisma =
  globalForPrisma.prisma ??
  (() => {
    const adapter = new PrismaPg(globalForPrisma.pool)
    return new PrismaClient({ adapter })
  })()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
