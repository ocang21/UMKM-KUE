/**
 * Mencari foto kue di Wikimedia Commons (search API) untuk kue yang
 * artikel Wikipedianya tidak memiliki gambar utama.
 * Jalankan: npx tsx prisma/fix-cake-images-commons.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// nama kue di DB -> kata kunci pencarian Commons (berurutan)
const SEARCHES: Record<string, string[]> = {
  "Kue Cantik Manis": ["kue cantik manis", "cantik manis jajanan", "cantik manis kue"],
  "Biji Salak": ["kolak biji salak", "biji salak bubur", "candil"],
};

async function searchCommonsImage(keyword: string): Promise<string | null> {
  try {
    const searchApi = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
      keyword
    )}&srnamespace=6&srlimit=5&format=json`;
    const res = await fetch(searchApi, {
      headers: { "User-Agent": "UMKM-Kue-App/1.0 (image fetcher)" },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      query?: { search?: { title: string }[] };
    };
    const results = (data.query?.search ?? []).filter((r) =>
      /\.(jpe?g|png|webp)$/i.test(r.title)
    );
    if (!results.length) return null;

    await sleep(1200);

    // Ambil URL thumbnail 800px dari file pertama
    const fileTitle = results[0].title;
    const infoApi = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(
      fileTitle
    )}&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json`;
    const res2 = await fetch(infoApi, {
      headers: { "User-Agent": "UMKM-Kue-App/1.0 (image fetcher)" },
      signal: AbortSignal.timeout(15000),
    });
    if (!res2.ok) return null;
    const data2 = (await res2.json()) as {
      query?: { pages?: Record<string, { imageinfo?: { thumburl?: string; url?: string }[] }> };
    };
    for (const page of Object.values(data2.query?.pages ?? {})) {
      const info = page.imageinfo?.[0];
      if (info?.thumburl) return info.thumburl;
      if (info?.url) return info.url;
    }
    return null;
  } catch {
    return null;
  }
}

async function verifyImage(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (UMKM-Kue Validator)" },
      signal: AbortSignal.timeout(15000),
    });
    return res.ok && (res.headers.get("content-type") || "").startsWith("image/");
  } catch {
    return false;
  }
}

async function main() {
  console.log("🔍 Mencari foto di Wikimedia Commons...\n");

  for (const [cakeKey, keywords] of Object.entries(SEARCHES)) {
    console.log(`🍰 ${cakeKey}`);
    let finalUrl: string | null = null;

    for (const kw of keywords) {
      const url = await searchCommonsImage(kw);
      await sleep(1500);
      if (url && (await verifyImage(url))) {
        finalUrl = url;
        console.log(`   ✅ [${kw}] ${url.slice(0, 100)}`);
        break;
      }
      console.log(`   ❌ [${kw}] tidak ketemu`);
    }

    if (!finalUrl) {
      console.log("   ⚠️ Gagal, dilewati.\n");
      continue;
    }

    const result = await prisma.cake.updateMany({
      where: { name: { contains: cakeKey } },
      data: { imageUrl: finalUrl },
    });
    console.log(`   💾 ${result.count} baris diupdate\n`);
  }

  console.log("✅ Selesai!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
