import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings-server";

// Endpoint AI Chat Assistant untuk Toko Kue UMKM
export async function POST(request: Request) {
  try {
    const { message, history, currentPath } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Pesan tidak valid" }, { status: 400 });
    }

    // Mapping path halaman ke nama deskriptif
    const pageMapping: Record<string, string> = {
      "/": "Halaman Beranda Utama (Homepage)",
      "/tentang": "Halaman Tentang Kami (Cerita Dapur & 3 Pilar Dedikasi)",
      "/menu": "Halaman Menu Spesial (Katalog 20+ Varian Kue & Filter)",
      "/keunggulan": "Halaman Keunggulan (Standar Bahan Alami & Jaminan Halal)",
      "/kontak": "Halaman Kontak (WhatsApp, Email & Alamat Dapur di Samata Gowa)",
      "/order": "Halaman Formulir Pemesanan (Keranjang Pesanan, Jadwal Ambil, Rekening & Bukti Transfer)",
      "/login": "Halaman Portal Penjual (Login Akun Pengelola)",
      "/register": "Halaman Registrasi Penjual (Daftar Akun)",
      "/dashboard": "Halaman Dashboard Utama Penjual",
      "/dashboard/cakes": "Halaman Manajemen Menu Kue (Admin)",
      "/dashboard/orders": "Halaman Manajemen Pesanan Masuk (Admin)",
      "/dashboard/payment": "Halaman Rekening Pembayaran (Admin)",
      "/dashboard/content": "Halaman CMS Pengelola Konten & Teks Website (Admin)",
    };

    const cleanPath = (currentPath || "/").split("?")[0];
    const currentPageName = pageMapping[cleanPath] || `Halaman ${cleanPath}`;

    // Ambil data menu kue aktif, rekening pembayaran, & konfigurasi toko terbaru dari database
    const [cakes, paymentAccounts, settings] = await Promise.all([
      prisma.cake.findMany({
        where: { isAvailable: true },
        select: { id: true, name: true, price: true },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      prisma.paymentAccount.findMany({
        select: { bankName: true, accountNumber: true, accountName: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      getSiteSettings(),
    ]);

    const cakeListText = cakes
      .map((c, i) => `${i + 1}. ${c.name} - Rp ${c.price.toLocaleString("id-ID")}`)
      .join("\n");

    const paymentText = paymentAccounts.length > 0
      ? paymentAccounts.map(p => `• Bank: ${p.bankName} | No. Rek: ${p.accountNumber} | a.n: ${p.accountName}`).join("\n")
      : `• Bank BCA | No. Rek: 8415-0921-3321 | a.n: ${settings.storeName} Official`;

    const systemPrompt = `Kamu adalah "Chef Pastry AI" – Asisten Virtual Resmi dan Konsultan Kue dari toko "${settings.storeName}" (${settings.tagline}).
Kamu menguasai SELURUH informasi, fitur, menu, alur transaksi, dan halaman yang ada di website ini.

============================================================
KNOWLEDGE BASE LENGKAP WEBSITE TOKO KUE UMKM:
============================================================

📍 LOKASI POSISI PENGUNJUNG SAAT INI:
- Pengunjung sedang aktif berada di: "${cleanPath}" -> **${currentPageName}**.
- Jika pengunjung bertanya "saya di halaman mana?", "ini halaman apa?", atau sejenisnya, JAWAB DENGAN TEPAT bahwa Kakak sedang berada di **${currentPageName}** (${cleanPath}), lalu jelaskan fungsi serta apa saja yang bisa dilakukan di halaman tersebut!

1. 🏢 PROFIL & IDENTITAS TOKO:
- Nama Toko: ${settings.storeName}
- Tagline: ${settings.tagline}
- Pengumuman: ${settings.announcement}
- Alamat Fisik / Dapur: ${settings.address} (Samata, Somba Opu, Gowa, Sulawesi Selatan)
- Jam Operasional Dapur & Toko: ${settings.openingHours}
- WhatsApp Resmi: +62 ${settings.whatsappNumber} (https://wa.me/${settings.whatsappNumber.replace(/^0/, '62')})
- Email Resmi: ${settings.email}
- Filosofi Rasa: Resep warisan keluarga turun-temurun, dibuat fresh setiap subuh, 100% bahan alami pilihan (mentega asli, santan murni, gula aren, daun pandan segar), TANPA pengawet & pewarna buatan, 100% Halal dan Higienis.

2. 🗺️ STRUKTUR & FITUR HALAMAN WEBSITE:
- Halaman Beranda (/) : Menampilkan Hero Centerpiece animasi bertekstur linen cream, 4 ikon interaktif melayang (Morning Coffee, Croissant, Gourmet Cake, Artisan Bread), Counter statistik animasi (100+ pelanggan, 50+ varian kue, 100% alami, 5.0 rating), 5 menu kue pilihan teratas, cuplikan cerita toko, dan CTA pemesanan.
- Halaman Tentang Kami (/tentang) : Cerita sejarah dapur keluarga, 3 pilar dedikasi kualitas (${settings.pillar1Title}, ${settings.pillar2Title}, ${settings.pillar3Title}), dan filosofi rasa.
- Halaman Menu Spesial (/menu) : Katalog lengkap seluruh varian kue dengan filter kategori (Kue Basah & Chiffon, Croissant & Pastry, Roti & Donat, Tart & Cake, Kue Kering Toples).
- Halaman Keunggulan (/keunggulan) : Standar kualitas (${settings.feature1Title}, ${settings.feature2Title}, ${settings.feature3Title}) serta sertifikasi jaminan ${settings.halalBoxTitle}.
- Halaman Kontak (/kontak) : Informasi direct link WhatsApp, email resmi, peta lokasi di Samata Gowa, dan jam operasional.
- Halaman Pemesanan (/order) : Formulir pemesanan online langsung dengan keranjang pesanan interaktif, penentuan tanggal & jam pengambilan, info rekening transfer, dan formulir upload bukti transfer.
- Portal Penjual (/login & /register) : Akses login dan pendaftaran akun pengelola toko.
- Dashboard Penjual (/dashboard) : Area admin untuk mengelola menu kue (tambah/edit/hapus), rekening bank, update status pesanan (menunggu -> diproses -> selesai), serta CMS edit konten teks website (/dashboard/content).

3. 🍰 DAFTAR MENU KUE & HARGA TERKINI:
${cakeListText}

4. 💳 CARA PEMESANAN & PEMBAYARAN:
- Sistem Pemesanan: Pre-Order H-1 (Pesan hari ini untuk diambil/diantar besok atau tanggal tertentu sesuai pilihan pembeli, karena semua kue dipanggang fresh di pagi hari).
- Cara Pesan Online di Website:
  1. Buka halaman Menu (/menu) atau klik tombol "Pesan Sekarang" (/order).
  2. Pilih kue dan atur jumlah (quantity) di keranjang pesanan.
  3. Isi data pemesan (Nama Lengkap, No. WhatsApp, Tanggal Ambil minimal H+1, Jam Ambil).
  4. Lakukan transfer sesuai total nominal ke rekening resmi toko.
  5. Unggah (upload) foto/screenshot bukti transfer di formulir, lalu klik "Konfirmasi & Kirim Pesanan".
- Rekening Pembayaran Resmi Toko:
${paymentText}
- Status Pesanan: Pesanan yang masuk akan berstatus "Menunggu" -> Diverifikasi oleh penjual -> "Diproses" (dibuat di dapur) -> "Selesai" saat siap diambil.

5. 💡 PANDUAN REKOMENDASI KUE UNTUK PELANGGAN:
- Untuk Acara Arisan / Kumpul Keluarga: Rekomendasikan kombinasi manis & gurih (Kue Lemper Ayam, Risoles Ragout, Barongko, Cantik Manis, Pastel).
- Khas Bugis-Makassar / Tradisional: Barongko Khas Bugis, Cantik Manis, Biji Salak, Cucur Pandan, Dadar Gulung, Nagasari.
- Untuk Hantaran / Hajatan / Acara Besar: Lapis Legit Spekoek, Bolu Gulung Pandan Keju, Bika Ambon Medan, Aneka Kue Kering Toples (Kastengel, Nastar, Putri Salju).
- Camilan Santai / Teman Kopi & Teh: Croissant, Cinnamon Roll, Donat Kentang, Banana Bread, Roti Sisir, Kue Lumpur.
- Budget Terjangkau (Di bawah Rp 5.000): Lemper Ayam (Rp 4.000), Risoles (Rp 4.000), Barongko (Rp 3.500), Klepon (Rp 3.000), Cantik Manis (Rp 2.500), Cucur (Rp 2.500).

============================================================
PANDUAN GAYA JAWABAN:
1. Bersikap ramah, sopan, antusias, hangat, dan informatif seperti Chef/Kasir Toko Kue profesional.
2. JANGAN mengulang template perkenalan panjang ("Halo Kak! Selamat datang di...") pada setiap giliran obrolan. Langsung jawab inti pertanyaan pelanggan dengan luwes.
3. Selalu sebutkan harga dengan format Rupiah yang tepat (contoh: Rp 3.500).
4. Jika pelanggan bertanya hal teknis website (cara pesan, rekening, alamat, posisi halaman), jelaskan dengan sangat jelas dan akurat sesuai pengetahuan di atas.
5. Gunakan format Markdown (bold, bullet points) dan emoji yang manis (🧁, 🍰, 🥐, ✨, 📍, 💳) agar mudah dibaca.`;

    // Format chat history untuk multi-turn conversation
    const formattedHistory = Array.isArray(history)
      ? history
          .filter((h: any) => h.text && (h.sender === "user" || h.sender === "assistant"))
          .slice(-8) // Ambil 8 pesan terakhir agar konteks tetap terjaga
          .map((h: any) => ({
            role: h.sender === "user" ? "user" : "model",
            parts: [{ text: h.text }],
          }))
      : [];

    const currentContents = [
      ...formattedHistory,
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    // 1. Cek Google Gemini API
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (geminiApiKey) {
      try {
        const geminiModels = ["gemini-3.6-flash", "gemini-3.7-flash", "gemini-flash-latest", "gemini-2.5-flash"];

        for (const model of geminiModels) {
          try {
            const geminiRes = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  system_instruction: {
                    parts: [{ text: systemPrompt }],
                  },
                  contents: currentContents,
                  generationConfig: {
                    temperature: 0.7,
                  },
                }),
              }
            );

            if (geminiRes.ok) {
              const geminiData = await geminiRes.json();
              const replyText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
              if (replyText) {
                return NextResponse.json({ reply: replyText, source: `Google Gemini (${model})` });
              }
            }
          } catch (mErr) {
            continue;
          }
        }
      } catch (geminiError) {
        console.error("Gemini API error:", geminiError);
      }
    }

    // 2. Cek OpenAI API (ChatGPT)
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (openaiApiKey) {
      try {
        const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiApiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: message },
            ],
            temperature: 0.7,
          }),
        });

        if (openaiRes.ok) {
          const openaiData = await openaiRes.json();
          const replyText = openaiData?.choices?.[0]?.message?.content;
          if (replyText) {
            return NextResponse.json({ reply: replyText, source: "OpenAI ChatGPT" });
          }
        }
      } catch (openaiError) {
        console.error("OpenAI API error:", openaiError);
      }
    }

    // 3. Cek Groq API
    const groqApiKey = process.env.GROQ_API_KEY;
    if (groqApiKey) {
      try {
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqApiKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: message },
            ],
            temperature: 0.7,
          }),
        });

        if (groqRes.ok) {
          const groqData = await groqRes.json();
          const replyText = groqData?.choices?.[0]?.message?.content;
          if (replyText) {
            return NextResponse.json({ reply: replyText, source: "Groq (Llama 3.3)" });
          }
        }
      } catch (groqError) {
        console.error("Groq API error:", groqError);
      }
    }

    // 4. Cek OpenRouter API
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    if (openRouterApiKey) {
      try {
        const orRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openRouterApiKey}`,
          },
          body: JSON.stringify({
            model: "deepseek/deepseek-chat",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: message },
            ],
          }),
        });

        if (orRes.ok) {
          const orData = await orRes.json();
          const replyText = orData?.choices?.[0]?.message?.content;
          if (replyText) {
            return NextResponse.json({ reply: replyText, source: "OpenRouter" });
          }
        }
      } catch (orError) {
        console.error("OpenRouter API error:", orError);
      }
    }

    // 5. Fallback ke Built-in Smart Bakery Knowledge Engine (Instan & 100% Mandiri)
    const reply = generateSmartBakeryResponse(message.toLowerCase(), cakes, paymentAccounts, settings, cleanPath, currentPageName);

    return NextResponse.json({ reply, source: "local-ai" });
  } catch (error) {
    console.error("AI Chat Error:", error);
    return NextResponse.json(
      {
        reply:
          "Maaf, saat ini asisten AI sedang menyiapkan adonan kue. Silakan hubungi kami langsung via WhatsApp di 081234567890 untuk bantuan cepat ya! 🧁✨",
      },
      { status: 200 }
    );
  }
}

// Mesin NLP Cerdas Khusus Toko Kue UMKM (Full Context Grounding)
function generateSmartBakeryResponse(
  query: string,
  cakes: { id: string; name: string; price: number }[],
  paymentAccounts: { bankName: string; accountNumber: string; accountName: string }[],
  settings: any,
  cleanPath: string = "/",
  currentPageName: string = "Halaman Beranda Utama"
): string {
  // 0. Pertanyaan Posisi Halaman Saat Ini
  if (query.includes("halaman mana") || query.includes("posisi") || query.includes("dimana saya") || query.includes("halaman apa") || query.includes("di mana saya") || query.includes("sedang dimana") || query.includes("lagi dimana")) {
    return `Saat ini Kakak sedang berada di **${currentPageName}** (\`${cleanPath}\`)! 📍✨\n\nDi halaman ini Kakak bisa menjelajahi fitur dan informasi toko kami. Ada yang bisa Chef bantu jelaskan tentang halaman ini? 🧁`;
  }

  // 1. Rekomendasi Acara (Arisan / Hajatan / Ulang Tahun)
  if (query.includes("arisan") || query.includes("hajatan") || query.includes("acara") || query.includes("kumpul") || query.includes("syukuran")) {
    const snackBoxCakes = cakes.filter(c => c.price <= 5000).slice(0, 5);
    const list = snackBoxCakes.map(c => `• **${c.name}** – Rp ${c.price.toLocaleString("id-ID")}`).join("\n");
    return `Untuk acara arisan atau kumpul keluarga, kami sangat menyarankan paket kombinasi kue manis & gurih berikut:\n\n${list}\n\n💡 *Catatan:* Semua kue dibuat fresh di hari pengambilan (H-1). Kakak bisa langsung klik menu **Pesan Sekarang** (/order) untuk memesan jumlah yang diinginkan! 🧁✨`;
  }

  // 2. Kue Tradisional Bugis-Makassar & Nusantara
  if (query.includes("bugis") || query.includes("makassar") || query.includes("tradisional") || query.includes("barongko") || query.includes("cantik manis") || query.includes("klepon")) {
    const tradCakes = cakes.filter(c =>
      c.name.toLowerCase().includes("barongko") ||
      c.name.toLowerCase().includes("cantik") ||
      c.name.toLowerCase().includes("klepon") ||
      c.name.toLowerCase().includes("lapis") ||
      c.name.toLowerCase().includes("cucur") ||
      c.name.toLowerCase().includes("nagasari")
    ).slice(0, 5);

    const list = tradCakes.map(c => `• **${c.name}** – Rp ${c.price.toLocaleString("id-ID")}`).join("\n");
    return `Toko kami menyediakan aneka kue tradisional otentik dengan resep warisan asli:\n\n${list}\n\nKue dibuat menggunakan santan segar, pisang pilihan, dan gula aren asli tanpa pengawet kimia. Cocok untuk sajian istimewa! 🍌✨`;
  }

  // 3. Cara Pemesanan & Alur Checkout
  if (query.includes("cara") || query.includes("pesan") || query.includes("order") || query.includes("checkout") || query.includes("ambil") || query.includes("jadwal")) {
    return `Berikut cara mudah memesan kue di **${settings.storeName}**:\n\n1️⃣ **Pilih Menu:** Buka halaman **/menu** atau klik tombol **Pesan Sekarang** (/order).\n2️⃣ **Atur Jumlah:** Tentukan kue dan jumlah pcs di keranjang.\n3️⃣ **Data Pengambilan:** Masukkan Nama, No. WhatsApp, serta Tanggal & Jam pengambilan (minimal H+1 karena kue dipanggang fresh subuh hari).\n4️⃣ **Pembayaran:** Transfer ke rekening toko dan unggah foto bukti transfer.\n5️⃣ **Konfirmasi:** Klik tombol kirim pesanan dan pesanan Anda langsung diproses dapur kami! 📅🥐`;
  }

  // 4. Info Rekening Pembayaran & Transfer Bank
  if (query.includes("rekening") || query.includes("bank") || query.includes("transfer") || query.includes("bayar") || query.includes("pembayaran")) {
    const rekList = paymentAccounts.length > 0
      ? paymentAccounts.map(p => `💳 **${p.bankName}**\n• No. Rekening: \`${p.accountNumber}\`\n• Atas Nama: **${p.accountName}**`).join("\n\n")
      : `💳 **BCA (Bank Central Asia)**\n• No. Rekening: \`8415-0921-3321\`\n• Atas Nama: **${settings.storeName} Official**`;
    return `Berikut informasi rekening resmi untuk transfer pembayaran pesanan:\n\n${rekList}\n\n*Setelah transfer, mohon lampirkan bukti pembayaran saat mengisi form di halaman /order ya Kak.* 🧾✨`;
  }

  // 5. Lokasi, Alamat Dapur & Jam Buka
  if (query.includes("lokasi") || query.includes("alamat") || query.includes("dimana") || query.includes("buka") || query.includes("tutup") || query.includes("jam")) {
    return `📍 **Alamat Dapur & Toko:**\n${settings.address}\n\n⏰ **Jam Buka & Operasional:**\n${settings.openingHours}\n\n*Pemesanan online melalui website dapat dilakukan 24 jam kapan saja.* Ada yang ingin ditanyakan lagi seputar rute atau lokasi? 🏠✨`;
  }

  // 6. Kontak WhatsApp & Customer Service
  if (query.includes("wa") || query.includes("whatsapp") || query.includes("hubungi") || query.includes("telepon") || query.includes("admin") || query.includes("cs")) {
    return `Untuk konsultasi langsung dengan pengelola toko atau pesanan khusus partai besar, silakan hubungi kami di:\n\n📱 **WhatsApp:** +62 ${settings.whatsappNumber}\n✉️ **Email:** ${settings.email}\n\nKami siap melayani kebutuhan kue Anda! 💬✨`;
  }

  // 7. Harga Murah / Budget Terjangkau
  if (query.includes("murah") || query.includes("budget") || query.includes("terjangkau") || query.includes("harga") || query.includes("di bawah")) {
    const affordable = cakes.filter(c => c.price <= 5000).slice(0, 5);
    const list = affordable.map(c => `• **${c.name}** – Rp ${c.price.toLocaleString("id-ID")}`).join("\n");
    return `Berikut daftar kue lezat dengan harga sangat terjangkau (Rp 2.500 - Rp 4.000 per pcs):\n\n${list}\n\nSangat pas untuk isian snack box maupun camilan sehari-hari! 🍰`;
  }

  // 8. Halaman Website & Navigasi
  if (query.includes("halaman") || query.includes("fitur") || query.includes("tab") || query.includes("website") || query.includes("dashboard")) {
    return `Website **${settings.storeName}** memiliki halaman-halaman berikut:\n\n🏠 **Beranda (/)** : Etalase utama & cuplikan menu pilihan\n📖 **Tentang Kami (/tentang)** : Kisah resep warisan & komitmen bahan alami\n🍰 **Menu Spesial (/menu)** : Daftar 20+ varian kue lengkap dengan filter kategori\n🏆 **Keunggulan (/keunggulan)** : Standar higienis & jaminan 100% Halal\n📍 **Kontak (/kontak)** : Alamat lengkap & kontak WhatsApp\n🛒 **Form Pemesanan (/order)** : Checkout & upload bukti transfer\n🔐 **Portal Penjual (/login)** : Dashboard admin pengelola kue`;
  }

  // 9. Default Response Ramah
  const topCakes = cakes.slice(0, 4).map(c => `• **${c.name}** (Rp ${c.price.toLocaleString("id-ID")})`).join("\n");
  return `Halo! Ada yang bisa Chef bantu seputar menu kue atau pemesanan hari ini? 🧁✨\n\nBeberapa menu favorit kami:\n${topCakes}\n\nKakak bisa menanyakan harga, bahan kue, cara order di halaman /order, atau rekomendasi acara! 😊`;
}
