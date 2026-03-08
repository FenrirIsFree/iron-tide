import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '.prisma/client'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient; pool: Pool }

if (!globalForPrisma.pool) {
  globalForPrisma.pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
    max: 1,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 10000,
    statement_timeout: 30000,
  } as ConstructorParameters<typeof Pool>[0])
}

const prisma =
  globalForPrisma.prisma ??
  (() => {
    const adapter = new PrismaPg(globalForPrisma.pool)
    return new PrismaClient({ adapter })
  })()

globalForPrisma.prisma = prisma

export default prisma
