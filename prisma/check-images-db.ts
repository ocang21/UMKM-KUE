import { PrismaClient } from '@prisma/client';
import { existsSync } from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const cakes = await prisma.cake.findMany({
    select: { name: true, imageUrl: true },
    orderBy: { name: 'asc' },
  });

  console.log('📸 imageUrl tersimpan di DATABASE, file fisik di public/:\n');
  let allOk = true;
  for (const c of cakes) {
    const url = c.imageUrl || '';
    const fileExists = url.startsWith('/uploads/')
      ? existsSync(path.join(process.cwd(), 'public', url))
      : false;
    if (!fileExists) allOk = false;
    console.log(`${fileExists ? '✅' : '❌'} ${c.name}`);
    console.log(`   DB imageUrl: ${url}`);
  }
  console.log(allOk
    ? '\n✅ Semua path di DB cocok dengan file fisik di public/uploads/cakes/'
    : '\n⚠️ Ada file yang hilang!');
}

main()
  .catch((e) => { console.error(e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
