import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '.prisma/client'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient; pool: Pool }

if (!globalForPrisma.pool) {
  globalForPrisma.pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
    max: 2,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 5000,
  })
}

const prisma =
  globalForPrisma.prisma ??
  (() => {
    const adapter = new PrismaPg(globalForPrisma.pool)
    return new PrismaClient({ adapter })
  })()

globalForPrisma.prisma = prisma

export default prisma
