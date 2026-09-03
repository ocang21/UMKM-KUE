/**
 * Download semua foto kue dari URL eksternal ke public/uploads/cakes/
 * lalu update imageUrl di database ke path lokal.
 * Menjamin gambar SELALU muncul tanpa bergantung CDN eksternal.
 *
 * Jalankan: npx tsx prisma/localize-cake-images.ts
 */
import { PrismaClient } from '@prisma/client';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();
const OUT_DIR = path.join(process.cwd(), 'public', 'uploads', 'cakes');

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function extFromContentType(ct: string): string {
  if (ct.includes('png')) return 'png';
  if (ct.includes('webp')) return 'webp';
  if (ct.includes('gif')) return 'gif';
  return 'jpg';
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const cakes = await prisma.cake.findMany({
    select: { id: true, name: true, imageUrl: true },
  });

  console.log(`📦 Melokalkan gambar ${cakes.length} kue...\n`);

  let ok = 0;
  let skip = 0;
  let fail = 0;

  for (const cake of cakes) {
    const url = cake.imageUrl || '';
    if (!url.startsWith('http')) {
      console.log(`⏭️ ${cake.name} — sudah lokal/base64, dilewati`);
      skip++;
      continue;
    }

    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (UMKM-Kue Downloader)' },
        signal: AbortSignal.timeout(60000),
      });
      const ct = res.headers.get('content-type') || '';
      if (!res.ok || !ct.startsWith('image/')) {
        console.log(`❌ ${cake.name} — HTTP ${res.status} (${ct})`);
        fail++;
        continue;
      }

      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 1000) {
        console.log(`❌ ${cake.name} — file terlalu kecil (${buf.length} B)`);
        fail++;
        continue;
      }

      const filename = `${slugify(cake.name)}.${extFromContentType(ct)}`;
      await writeFile(path.join(OUT_DIR, filename), buf);

      const localPath = `/uploads/cakes/${filename}`;
      await prisma.cake.update({
        where: { id: cake.id },
        data: { imageUrl: localPath },
      });

      console.log(`✅ ${cake.name} → ${localPath} (${(buf.length / 1024).toFixed(0)} KB)`);
      ok++;
    } catch (e) {
      console.log(`❌ ${cake.name} — ${(e as Error).message}`);
      fail++;
    }
  }

  console.log(`\n✅ Selesai! ${ok} disimpan lokal, ${skip} dilewati, ${fail} gagal.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
