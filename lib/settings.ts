export interface SiteSettings {
  // Informasi Toko & Kontak
  storeName: string;
  tagline: string;
  announcement: string;
  whatsappNumber: string;
  email: string;
  address: string;
  openingHours: string;

  // Hero Section
  heroBadge: string;
  heroTitle: string;
  heroTitleItalic: string;
  heroDescription: string;

  // Halaman / Section Tentang Kami
  aboutBadge: string;
  aboutTitle: string;
  aboutParagraph1: string;
  aboutParagraph2: string;
  aboutQuote: string;
  pillar1Title: string;
  pillar1Desc: string;
  pillar2Title: string;
  pillar2Desc: string;
  pillar3Title: string;
  pillar3Desc: string;

  // Halaman / Section Keunggulan
  advantagesBadge: string;
  advantagesTitle: string;
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;
  halalBoxTitle: string;
  halalBoxDesc: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  // Informasi Toko & Kontak
  storeName: "Toko Kue UMKM",
  tagline: "Artisan Bakery • Est. 2026",
  announcement: "✨ Dibuat Fresh Setiap Hari • 100% Bahan Alami Tanpa Pengawet • Pesan Hari Ini untuk Pengambilan Besok",
  whatsappNumber: "081234567890",
  email: "order@tokokueumkm.com",
  address: "Samata, Gowa, Sulawesi Selatan",
  openingHours: "Setiap Hari (08.00 - 18.00 WITA)",

  // Hero Section
  heroBadge: "Artisan Bakery & Traditional Cakes",
  heroTitle: "Freshly Baked,",
  heroTitleItalic: "Just for You.",
  heroDescription: "Kelezatan kue buatan tangan dengan cita rasa otentik warisan keluarga. Menggunakan bahan berkualitas tinggi tanpa pengawet, dibuat fresh untuk setiap momen istimewa Anda.",

  // Halaman / Section Tentang Kami
  aboutBadge: "Cerita & Tradisi Kami",
  aboutTitle: "Kelezatan Autentik dari Resep Turun-Temurun",
  aboutParagraph1: "Berawal dari kecintaan keluarga terhadap kue tradisional buatan rumah, kami mendedikasikan diri untuk menghadirkan rasa kue asli yang otentik, lembut, dan kaya rasa.",
  aboutParagraph2: "Setiap adonan dibuat secara teliti setiap subuh dengan standar kebersihan tinggi dan tanpa tambahan bahan pengawet sintetis.",
  aboutQuote: "Kue yang lezat bukan hanya tentang rasa manis, tapi tentang kehangatan momen di setiap gigitan.",
  pillar1Title: "Resep Warisan Asli",
  pillar1Desc: "Cita rasa tradisional yang autentik dan terjaga sejak generasi pertama.",
  pillar2Title: "100% Bahan Alami",
  pillar2Desc: "Tanpa pewarna buatan maupun pengawet kimiawi berbahaya.",
  pillar3Title: "Fresh from Oven",
  pillar3Desc: "Selalu dipanggang segar sesuai jadwal pemesanan Anda.",

  // Halaman / Section Keunggulan
  advantagesBadge: "Keunggulan Layanan",
  advantagesTitle: "Kenapa Memilih Kami?",
  feature1Title: "Bahan Baku Alami",
  feature1Desc: "Kami hanya menggunakan mentega berkualitas, telur segar, dan tepung pilihan tanpa tambahan pengawet kimiawi agar aman dikonsumsi seluruh keluarga.",
  feature2Title: "Dibuat Fresh Tiap Hari",
  feature2Desc: "Tidak ada stok lama. Kue dipanggang tepat waktu sesuai tanggal dan jam pengambilan yang Anda tentukan sehingga kualitasnya selalu maksimal.",
  feature3Title: "Pemesanan Sangat Mudah",
  feature3Desc: "Cukup pilih kue, tentukan jadwal ambil, dan upload bukti transfer. Anda juga bisa konfirmasi langsung ke WhatsApp pengelola.",
  halalBoxTitle: "100% Halal & Higienis",
  halalBoxDesc: "Standar kebersihan ruang produksi dan peralatan selalu disterilkan secara berkala untuk menjaga higienitas setiap hidangan kue.",
};
