import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const url = 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Spekkoek_naturel_en_pandan.jpg';
  const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  console.log('Verifikasi:', r.status, r.headers.get('content-type'));
  if (r.ok && (r.headers.get('content-type') || '').startsWith('image/')) {
    const u = await prisma.cake.updateMany({
      where: { name: { contains: 'Lapis Legit' } },
      data: { imageUrl: url },
    });
    console.log('Diupdate:', u.count, 'baris');
  }
}

main().finally(() => prisma.$disconnect());
