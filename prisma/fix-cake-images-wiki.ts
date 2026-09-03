/**
 * Mengambil foto ASLI kue tradisional langsung dari artikel Wikipedia Indonesia
 * melalui REST API resmi (page summary -> originalimage/thumbnail).
 * Setiap gambar dijamin sesuai nama kue karena diambil dari artikel kue tersebut.
 *
 * Jalankan: npx tsx prisma/fix-cake-images-wiki.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Pemetaan nama kue di database -> judul artikel Wikipedia ID (kandidat berurutan)
const CAKE_WIKI_ARTICLES: Record<string, string[]> = {
  "Barongko Khas Bugis": ["Barongko"],
  "Kue Cantik Manis Mutiara": ["Cantik_manis", "Kue_cantik_manis"],
  "Kue Klepon Gula Merah Lumer": ["Klepon"],
  "Kue Lapis Legit Spekoek": ["Spekuk", "Lapis_legit"],
  "Kue Cucur Pandan Wangi": ["Kue_cucur", "Cucur"],
  "Biji Salak Ubi Manis": ["Biji_salak"],
  "Bolu Gulung Pandan Keju": ["Bolu_gulung"],
  "Kue Dadar Gulung Kelapa": ["Dadar_gulung"],
  "Kue Putu Ayu Kelapa Parut": ["Putu_ayu", "Kue_putu"],
  "Kue Lapis Beras Pelangi": ["Kue_lapis"],
  "Kue Lemper Ayam Gurih": ["Lemper"],
  "Kue Lumpur Kentang Kismis": ["Kue_lumpur"],
  "Kue Onde-Onde Wijen Kacang Hijau": ["Onde-onde"],
  "Kue Bika Ambon Medan": ["Bika_ambon"],
  "Kue Pastel Goreng Renyah": ["Pastel_(makanan)", "Karipap"],
  "Kue Risoles Ragout Ayam": ["Risoles"],
  "Kue Nagasari Pisang": ["Nagasari"],
  "Kue Semar Mendem": ["Semar_mendem", "Lemper"],
  "Kue Wajik Ketan Gula Merah": ["Wajik"],
  "Kue Carabikang Mekar": ["Carabikang", "Kue_bikang"],
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function getWikiImage(article: string): Promise<string | null> {
  const langs = ["id", "en"];
  for (const lang of langs) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        // MediaWiki pageimages API: menghasilkan URL thumbnail valid pada ukuran diminta
        const api = `https://${lang}.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
          article
        )}&prop=pageimages&format=json&pithumbsize=800&redirects=1`;
        const res = await fetch(api, {
          headers: { "User-Agent": "UMKM-Kue-App/1.0 (image fetcher; contact: admin@umkmkue.local)" },
          signal: AbortSignal.timeout(15000),
        });
        if (res.status === 429) {
          await sleep(5000 * (attempt + 1));
          continue;
        }
        if (!res.ok) break;
        const text = await res.text();
        if (text.startsWith("You are making too many")) {
          await sleep(5000 * (attempt + 1));
          continue;
        }
        const data = JSON.parse(text) as {
          query?: { pages?: Record<string, { thumbnail?: { source: string } }> };
        };
        const pages = data.query?.pages ?? {};
        for (const page of Object.values(pages)) {
          if (page.thumbnail?.source) return page.thumbnail.source;
        }
        break; // artikel ada tapi tak punya gambar -> coba bahasa berikutnya
      } catch {
        await sleep(2000);
      }
    }
    await sleep(1200);
  }
  return null;
}

async function verifyImage(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": "Mozilla/5.0 (UMKM-Kue Validator)" },
      signal: AbortSignal.timeout(10000),
    });
    return res.ok && (res.headers.get("content-type") || "").startsWith("image/");
  } catch {
    return false;
  }
}

async function main() {
  console.log("🔍 Mengambil foto asli kue dari Wikipedia...\n");

  let updated = 0;
  let failed: string[] = [];

  for (const [cakeName, articles] of Object.entries(CAKE_WIKI_ARTICLES)) {
    console.log(`🍰 ${cakeName}`);
    let finalUrl: string | null = null;

    for (const article of articles) {
      const imgUrl = await getWikiImage(article);
      await sleep(1500); // jeda agar tidak kena rate limit Wikipedia
      if (imgUrl && (await verifyImage(imgUrl))) {
        finalUrl = imgUrl;
        console.log(`   ✅ [${article}] ${imgUrl.slice(0, 95)}`);
        break;
      } else {
        console.log(`   ❌ [${article}] tidak ada gambar valid`);
      }
    }

    if (!finalUrl) {
      failed.push(cakeName);
      console.log("");
      continue;
    }

    const keyword = cakeName.split(" ").slice(0, 2).join(" ");
    const result = await prisma.cake.updateMany({
      where: { name: { contains: keyword } },
      data: { imageUrl: finalUrl },
    });
    console.log(`   💾 ${result.count} baris diupdate\n`);
    updated += result.count;
  }

  console.log(`\n✅ Selesai! ${updated} kue diperbarui.`);
  if (failed.length) {
    console.log(`⚠️ Belum menemukan foto valid untuk: ${failed.join(", ")}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
