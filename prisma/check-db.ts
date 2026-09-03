import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const info = await prisma.$queryRaw<{ db: string; host: string }[]>`
    SELECT current_database() AS db, inet_server_addr()::text AS host
  `;
  const [cakes, users, orders, payments] = await Promise.all([
    prisma.cake.count(),
    prisma.user.count(),
    prisma.order.count(),
    prisma.paymentAccount.count(),
  ]);
  console.log('✅ TERHUBUNG ke database:', JSON.stringify(info[0]));
  console.log('   Kue:', cakes, '| User:', users, '| Order:', orders, '| Rekening:', payments);
  const sample = await prisma.cake.findFirst({ select: { name: true, imageUrl: true } });
  console.log('   Contoh kue:', sample?.name, '->', sample?.imageUrl);
}

main()
  .catch((e) => {
    console.error('❌ GAGAL terhubung:', e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
