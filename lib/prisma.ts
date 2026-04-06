// Import PrismaClient dari package @prisma/client
import { PrismaClient } from '@prisma/client'

// Type assertion untuk global object agar TypeScript mengenali property prisma
// Ini untuk menyimpan instance Prisma di global scope (development hot reload)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Singleton pattern untuk Prisma Client
// Jika sudah ada instance di global, gunakan yang sudah ada
// Jika belum, buat instance baru
// Ini penting untuk menghindari terlalu banyak koneksi database saat development
export const prisma = globalForPrisma.prisma ?? new PrismaClient()

// Di development mode, simpan instance Prisma di global object
// Agar tidak dibuat ulang setiap kali hot reload
// Di production, tidak perlu karena tidak ada hot reload
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
