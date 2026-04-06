// Import Prisma Client untuk akses database
import { PrismaClient } from '@prisma/client';
// Import bcrypt untuk hashing password
import bcrypt from 'bcryptjs';

// Inisialisasi Prisma Client
const prisma = new PrismaClient();

// Fungsi utama untuk seeding database
async function main() {
  // Hash password default untuk akun seller demo
  const hashedPassword = await bcrypt.hash('umkmkue123', 10);
  
  // Buat atau update akun seller demo
  // Menggunakan upsert: create jika belum ada, update jika sudah ada
  const seller = await prisma.user.upsert({
    where: { email: 'kuetradisional@penjual' },
    update: {}, // Tidak update apa-apa jika sudah ada
    create: {
      email: 'kuetradisional@penjual',
      password: hashedPassword,
      name: 'Admin Toko Kue',
      role: 'seller',
    },
  });

  // Log kredensial akun demo untuk testing
  console.log('✅ Akun penjual berhasil dibuat:', seller.email);
  console.log('📧 Email: kuetradisional@penjual');
  console.log('🔑 Password: umkmkue123');
}

// Jalankan fungsi main dengan error handling
main()
  .catch((e) => {
    // Log error jika ada masalah
    console.error(e);
    process.exit(1); // Exit dengan kode error
  })
  .finally(async () => {
    // Disconnect Prisma Client setelah selesai
    await prisma.$disconnect();
  });
