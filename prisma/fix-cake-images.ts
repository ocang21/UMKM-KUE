/**
 * Script untuk memvalidasi dan memperbaiki gambar menu kue agar sesuai
 * dengan nama kue tradisional aslinya.
 * Sumber gambar: Wikimedia Commons (foto kue asli Indonesia) dengan
 * kandidat fallback. Setiap URL diverifikasi (HTTP 200 + content-type image)
 * sebelum disimpan ke database.
 *
 * Jalankan: npx tsx prisma/fix-cake-images.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Daftar kue dengan kandidat URL gambar ASLI sesuai jenis kuenya.
// Urutan kandidat: paling akurat lebih dulu, fallback di belakang.
const CAKE_IMAGE_CANDIDATES: Record<string, string[]> = {
  "Barongko Khas Bugis": [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Barongko.jpg/640px-Barongko.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Barongko_Khas_Bugis.jpg/640px-Barongko_Khas_Bugis.jpg",
    "https://images.unsplash.com/photo-1601000938259-9e92002320b2?auto=format&fit=crop&w=640&q=80",
  ],
  "Kue Cantik Manis Mutiara": [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Kue_cantik_manis.jpg/640px-Kue_cantik_manis.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Cantik_Manis.JPG/640px-Cantik_Manis.JPG",
    "https://images.unsplash.com/photo-1615837197154-2ee2ecb08a30?auto=format&fit=crop&w=640&q=80",
  ],
  "Kue Klepon Gula Merah Lumer": [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Klepon_klepon.jpg/640px-Klepon_klepon.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Klepon_Surabaya.jpg/640px-Klepon_Surabaya.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Kelepon.jpg/640px-Kelepon.jpg",
  ],
  "Kue Lapis Legit Spekoek": [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Lapis_legit.jpg/640px-Lapis_legit.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Spekuk.jpg/640px-Spekuk.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Spekkoek_lapis_legit.jpg/640px-Spekkoek_lapis_legit.jpg",
  ],
  "Kue Cucur Pandan Wangi": [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Kue_cucur.jpg/640px-Kue_cucur.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Kuih_cucur.JPG/640px-Kuih_cucur.JPG",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Cucur.jpg/640px-Cucur.jpg",
  ],
  "Biji Salak Ubi Manis": [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Biji_salak.jpg/640px-Biji_salak.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Kolak_biji_salak.jpg/640px-Kolak_biji_salak.jpg",
    "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=640&q=80",
  ],
  "Bolu Gulung Pandan Keju": [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Pandan_swiss_roll.jpg/640px-Pandan_swiss_roll.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Bolu_gulung.jpg/640px-Bolu_gulung.jpg",
    "https://images.unsplash.com/photo-1614145121029-83a9f7b68bf4?auto=format&fit=crop&w=640&q=80",
  ],
  "Kue Dadar Gulung Kelapa": [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Kue_dadar_gulung.jpg/640px-Kue_dadar_gulung.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Dadar_gulung.jpg/640px-Dadar_gulung.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Dadar_Gulung_Pandan.jpg/640px-Dadar_Gulung_Pandan.jpg",
  ],
  "Kue Putu Ayu Kelapa Parut": [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Putu_ayu.jpg/640px-Putu_ayu.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Kue_putu_ayu.jpg/640px-Kue_putu_ayu.jpg",
    "https://images.unsplash.com/photo-1587248720327-8eb72564be1e?auto=format&fit=crop&w=640&q=80",
  ],
  "Kue Lapis Beras Pelangi": [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Kue_lapis.jpg/640px-Kue_lapis.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Kue_Lapis_Pepe.jpg/640px-Kue_Lapis_Pepe.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Kue_lapis_2.jpg/640px-Kue_lapis_2.jpg",
  ],
  "Kue Lemper Ayam Gurih": [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Lemper_Ayam_2.jpg/640px-Lemper_Ayam_2.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Lemper_ayam.jpg/640px-Lemper_ayam.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Lemper.jpg/640px-Lemper.jpg",
  ],
  "Kue Lumpur Kentang Kismis": [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Kue_lumpur.jpg/640px-Kue_lumpur.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Kue_Lumpur.JPG/640px-Kue_Lumpur.JPG",
    "https://images.unsplash.com/photo-1626803775151-61d756612f97?auto=format&fit=crop&w=640&q=80",
  ],
  "Kue Onde-Onde Wijen Kacang Hijau": [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Onde-onde.jpg/640px-Onde-onde.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Onde-onde_2.JPG/640px-Onde-onde_2.JPG",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Jin_deui.jpg/640px-Jin_deui.jpg",
  ],
  "Kue Bika Ambon Medan": [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Bika_ambon.jpg/640px-Bika_ambon.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Bika_Ambon.JPG/640px-Bika_Ambon.JPG",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Bika_ambon_medan.jpg/640px-Bika_ambon_medan.jpg",
  ],
  "Kue Pastel Goreng Renyah": [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Pastel_goreng.jpg/640px-Pastel_goreng.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Pastel_%28food%29.jpg/640px-Pastel_%28food%29.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Karipap.jpg/640px-Karipap.jpg",
  ],
  "Kue Risoles Ragout Ayam": [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Risoles.jpg/640px-Risoles.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Risoles_Jakarta.jpg/640px-Risoles_Jakarta.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Rissole.jpg/640px-Rissole.jpg",
  ],
  "Kue Nagasari Pisang": [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Nagasari.jpg/640px-Nagasari.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Kue_nagasari.jpg/640px-Kue_nagasari.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Nagasari_2.JPG/640px-Nagasari_2.JPG",
  ],
  "Kue Semar Mendem": [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Semar_mendem.jpg/640px-Semar_mendem.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Semar_Mendem.JPG/640px-Semar_Mendem.JPG",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Lemper_ayam.jpg/640px-Lemper_ayam.jpg",
  ],
  "Kue Wajik Ketan Gula Merah": [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Wajik.jpg/640px-Wajik.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Wajik_ketan.jpg/640px-Wajik_ketan.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Wajik_2.JPG/640px-Wajik_2.JPG",
  ],
  "Kue Carabikang Mekar": [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Carabikang.jpg/640px-Carabikang.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Kue_carabikang.jpg/640px-Kue_carabikang.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Bika.jpg/640px-Bika.jpg",
  ],
};

// Fallback terakhir universal (foto jajanan pasar Indonesia asli yang valid)
const UNIVERSAL_FALLBACK =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Jajan_pasar.jpg/640px-Jajan_pasar.jpg";

async function isImageUrlValid(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": "Mozilla/5.0 (UMKM-Kue Image Validator)" },
      signal: AbortSignal.timeout(10000),
    });
    const contentType = res.headers.get("content-type") || "";
    return res.ok && contentType.startsWith("image/");
  } catch {
    return false;
  }
}

async function findValidImage(candidates: string[]): Promise<string | null> {
  for (const url of candidates) {
    const valid = await isImageUrlValid(url);
    console.log(`   ${valid ? "✅" : "❌"} ${url.slice(0, 90)}`);
    if (valid) return url;
  }
  return null;
}

async function main() {
  console.log("🔍 Memvalidasi & memperbaiki gambar 20 menu kue...\n");

  // Validasi fallback universal dulu
  const fallbackValid = await isImageUrlValid(UNIVERSAL_FALLBACK);
  console.log(`Fallback universal: ${fallbackValid ? "✅ valid" : "❌ invalid"}\n`);

  let updated = 0;
  let failed = 0;

  for (const [cakeName, candidates] of Object.entries(CAKE_IMAGE_CANDIDATES)) {
    console.log(`🍰 ${cakeName}`);
    const validUrl = await findValidImage(candidates);
    const finalUrl = validUrl || (fallbackValid ? UNIVERSAL_FALLBACK : null);

    if (!finalUrl) {
      console.log(`   ⚠️ Tidak ada URL valid, dilewati.\n`);
      failed++;
      continue;
    }

    const result = await prisma.cake.updateMany({
      where: { name: { contains: cakeName.split(" ").slice(0, 2).join(" ") } },
      data: { imageUrl: finalUrl },
    });

    console.log(`   💾 ${result.count} baris diupdate → ${finalUrl.slice(0, 80)}\n`);
    updated += result.count;
  }

  console.log(`\n✅ Selesai! ${updated} kue diperbarui, ${failed} gagal.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
