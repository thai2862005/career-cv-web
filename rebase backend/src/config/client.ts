//đây là đoạn code để kết nối với cơ sở dữ liệu sử dụng Prisma Client.
import { PrismaClient } from '@prisma/client'
import 'dotenv/config'
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma || new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? [] : ['query', 'info', 'warn', 'error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma