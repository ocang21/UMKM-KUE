'use client';

import Link from "next/link";
import SharedImage from "@/components/SharedImage";
import { useState, useEffect } from "react";
import { SAMPLE_20_CAKES, CakeItem } from "@/lib/sampleCakes";

export default function MenuPage() {
  const [cakes, setCakes] = useState<CakeItem[]>(SAMPLE_20_CAKES);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("semua");

  useEffect(() => {
    fetch("/api/cakes/available")
      .then((res) => {
        if (!res.ok) return;
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCakes(data);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const categories = [
    { id: "semua", name: "Semua Menu" },
    { id: "kue-basah", name: "Kue Basah & Chiffon" },
    { id: "pastry", name: "Croissant & Pastry" },
    { id: "roti", name: "Roti & Donat" },
    { id: "tart", name: "Tart & Cake" },
    { id: "kue-kering", name: "Kue Kering (Toples)" },
  ];

  const filteredCakes = selectedCategory === "semua"
    ? cakes
    : cakes.filter(c => c.category === selectedCategory || !c.category);

  return (
    <div className="min-h-screen bg-cream-50 text-neutral-800 selection:bg-accent-gold selection:text-white flex flex-col justify-between">
      {/* Top Announcement Bar */}
      <div className="bg-primary-900 text-cream-100 text-xs py-2 px-4 text-center tracking-wider font-medium border-b border-primary-800">
        <div className="container mx-auto flex justify-center items-center gap-3">
          <span>✨ Dibuat Fresh Setiap Hari</span>
          <span className="opacity-40">•</span>
          <span>Pesan Hari Ini untuk Pengambilan Besok</span>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="border-b border-cream-200 bg-cream-50/90 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 py-3.5 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-accent-gold shadow-warm-sm group-hover:scale-105 transition-transform flex-shrink-0 bg-cream-100">
              <img src="/logo.jpeg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold tracking-tight text-primary-900 leading-tight">
                Toko Kue UMKM
              </h1>
              <p className="text-[10px] tracking-widest uppercase font-semibold text-accent-gold">
                Artisan Bakery • Est. 2026
              </p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
            <Link href="/" className="text-neutral-700 hover:text-primary-700 transition">
              Beranda
            </Link>
            <Link href="/tentang" className="text-neutral-700 hover:text-primary-700 transition">
              Tentang Kami
            </Link>
            <Link href="/menu" className="text-primary-800 font-bold border-b-2 border-accent-gold pb-0.5">
              Menu Spesial
            </Link>
            <Link href="/keunggulan" className="text-neutral-700 hover:text-primary-700 transition">
              Keunggulan
            </Link>
            <Link href="/kontak" className="text-neutral-700 hover:text-primary-700 transition">
              Kontak
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/order" className="btn-primary text-xs uppercase tracking-wider py-2 px-5">
              Pesan Sekarang
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto max-w-7xl px-4 py-12 md:py-20 flex-1">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-accent-amber block mb-2">
            Katalog Lengkap
          </span>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-primary-900 mb-4">
            Daftar Menu Kue
          </h1>
          <div className="w-16 h-0.5 bg-accent-gold mx-auto mb-3"></div>
          <p className="text-neutral-600 text-sm md:text-base">
            Pilih kue kesukaan Anda dan pesan langsung secara online untuk santap hangat bersama keluarga.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
                selectedCategory === category.id
                  ? "bg-primary-800 text-cream-50 shadow-warm-sm"
                  : "bg-white text-neutral-700 border border-cream-300 hover:border-primary-500"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-2 border-primary-700 border-t-transparent"></div>
            <p className="mt-4 text-neutral-600 text-sm">Memuat menu kue...</p>
          </div>
        ) : filteredCakes.length === 0 ? (
          <div className="text-center py-16 card-artisan max-w-md mx-auto p-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cream-100 flex items-center justify-center text-primary-700 font-display text-2xl font-bold border border-cream-300">
              🧁
            </div>
            <h3 className="text-xl font-display font-bold text-primary-900 mb-2">Menu Segera Hadir</h3>
            <p className="text-neutral-600 text-sm">
              Kami sedang menyiapkan varian kue fresh untuk Anda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCakes.map((cake) => (
              <div
                key={cake.id}
                className="group bg-white rounded-xl border border-cream-200 overflow-hidden shadow-warm-sm hover:shadow-warm-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream-100">
                    <SharedImage
                      src={cake.imageUrl}
                      alt={cake.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="bg-white/95 backdrop-blur-sm text-primary-900 text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border border-cream-300 shadow-sm">
                        {cake.isAvailable ? "Ready" : "Habis"}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-1 text-accent-gold text-xs mb-1.5">
                      <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                      <span className="text-neutral-400 text-[10px] ml-1">(5.0)</span>
                    </div>
                    <h3 className="font-display font-semibold text-base text-primary-900 line-clamp-1">
                      {cake.name}
                    </h3>
                    <p className="text-primary-700 font-bold text-lg mt-1 font-sans">
                      Rp {cake.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    href={`/order?cakeId=${cake.id}`}
                    className="w-full btn-primary text-xs tracking-wider uppercase py-2.5 flex items-center justify-center gap-2"
                  >
                    <span>Pesan Sekarang</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#1C120A] text-cream-200 py-10 px-4 border-t border-primary-900 mt-16">
        <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p>© 2026 Toko Kue UMKM. Seluruh Hak Cipta Dilindungi.</p>
          <div className="flex gap-6 text-cream-400">
            <Link href="/" className="hover:text-accent-gold">Beranda</Link>
            <Link href="/tentang" className="hover:text-accent-gold">Tentang Kami</Link>
            <Link href="/keunggulan" className="hover:text-accent-gold">Keunggulan</Link>
            <Link href="/kontak" className="hover:text-accent-gold">Kontak</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}