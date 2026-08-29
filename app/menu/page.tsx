'use client';

import Link from "next/link";
import SharedImage from "@/components/SharedImage";
import { useState, useEffect } from "react";
import { SAMPLE_20_CAKES, CakeItem } from "@/lib/sampleCakes";

export default function MenuPage() {
  const [cakes, setCakes] = useState<CakeItem[]>(SAMPLE_20_CAKES);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("semua");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const getCakeCategory = (name: string): string => {
    const lower = (name || "").toLowerCase();
    if (lower.includes("croissant") || lower.includes("pastry") || lower.includes("danish") || lower.includes("puff")) return "pastry";
    if (lower.includes("roti") || lower.includes("donat") || lower.includes("bread") || lower.includes("bun")) return "roti";
    if (lower.includes("tart") || lower.includes("pie") || lower.includes("cake") || lower.includes("chiffon") || lower.includes("bolu") || lower.includes("brownies")) return "tart";
    return "kue-basah";
  };

  const categories = [
    { id: "semua", name: "Semua Menu" },
    { id: "kue-basah", name: "Kue Tradisional & Basah" },
    { id: "pastry", name: "Croissant & Pastry" },
    { id: "roti", name: "Roti & Donat" },
    { id: "tart", name: "Bolu & Cake" },
  ];

  const filteredCakes = selectedCategory === "semua"
    ? cakes
    : cakes.filter(c => (c.category || getCakeCategory(c.name)) === selectedCategory);

  return (
    <div className="min-h-screen bg-cream-50 text-neutral-800 selection:bg-accent-gold selection:text-white flex flex-col justify-between">
      {/* Top Announcement Bar */}
      <div className="bg-primary-900 text-cream-100 text-[11px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-4 text-center tracking-wide sm:tracking-wider font-medium border-b border-primary-800">
        <div className="container mx-auto flex justify-center items-center gap-2">
          <span>✨ Dibuat Fresh Setiap Hari • Pesan Hari Ini untuk Pengambilan Besok</span>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="border-b border-cream-200 bg-cream-50/90 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 py-2.5 sm:py-3.5">
          <div className="flex justify-between items-center">
            {/* Brand Logo & Name */}
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-accent-gold shadow-warm-sm group-hover:scale-105 transition-transform flex-shrink-0 bg-cream-100">
                <img src="/logo.jpeg" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-display font-bold tracking-tight text-primary-900 leading-tight">
                  Toko Kue UMKM
                </h1>
                <p className="text-[9px] sm:text-[10px] tracking-widest uppercase font-semibold text-accent-gold">
                  Artisan Bakery • Est. 2026
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
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

            {/* Right Action Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className="text-xs font-semibold text-primary-800 hover:text-primary-900 px-3 py-2 transition tracking-wider uppercase"
              >
                Portal Penjual
              </Link>
              <Link href="/order" className="btn-primary text-xs uppercase tracking-wider py-2 px-5">
                Pesan Sekarang
              </Link>
            </div>

            {/* Mobile Actions: Back to Home + Hamburger Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary-800 bg-cream-100 px-2.5 py-1.5 rounded-full border border-cream-300 hover:bg-cream-200 transition"
              >
                <span>←</span>
                <span>Beranda</span>
              </Link>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1.5 text-primary-900 rounded-lg focus:outline-none bg-cream-100 border border-cream-300"
                aria-label="Toggle Menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-3 pt-4 pb-2 border-t border-cream-200 animate-in fade-in duration-200">
              <div className="flex flex-col gap-2.5 text-sm">
                <Link
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-primary-900 hover:text-primary-700 py-1.5 px-2 font-semibold flex items-center justify-between bg-cream-100 rounded-lg"
                >
                  <span>🏠 Kembali ke Beranda</span>
                  <span>➔</span>
                </Link>
                <Link
                  href="/tentang"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-neutral-700 hover:text-primary-800 py-1.5 px-2 font-medium"
                >
                  Tentang Kami
                </Link>
                <Link
                  href="/menu"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-primary-800 font-bold py-1.5 px-2 bg-cream-50 rounded-lg"
                >
                  Menu Spesial
                </Link>
                <Link
                  href="/keunggulan"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-neutral-700 hover:text-primary-800 py-1.5 px-2 font-medium"
                >
                  Keunggulan
                </Link>
                <Link
                  href="/kontak"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-neutral-700 hover:text-primary-800 py-1.5 px-2 font-medium"
                >
                  Kontak
                </Link>
                <div className="pt-2 flex flex-col gap-2 border-t border-cream-200">
                  <Link
                    href="/order"
                    onClick={() => setIsMenuOpen(false)}
                    className="btn-primary text-center text-xs uppercase tracking-wider py-2.5"
                  >
                    Pesan Sekarang
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-center text-xs font-semibold py-2 text-primary-800 hover:underline"
                  >
                    Login Penjual
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto max-w-7xl px-3.5 sm:px-6 py-6 sm:py-12 md:py-20 flex-1">
        {/* Breadcrumb Kembali ke Beranda */}
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent-amber hover:text-primary-800 transition"
          >
            <span>←</span>
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-semibold text-accent-amber block mb-1.5">
            Katalog Lengkap
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-display font-bold text-primary-900 mb-2 sm:mb-3">
            Daftar Menu Kue
          </h1>
          <div className="w-12 sm:w-16 h-0.5 bg-accent-gold mx-auto mb-2.5"></div>
          <p className="text-neutral-600 text-xs sm:text-sm md:text-base px-2">
            Pilih kue kesukaan Anda dan pesan langsung secara online untuk santap hangat bersama keluarga.
          </p>
        </div>

        {/* Category Filter Pills (Disembunyikan di HP, hanya tampil di Desktop) */}
        <div className="hidden sm:flex justify-center gap-2 mb-6 sm:mb-10">
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
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {filteredCakes.map((cake) => (
              <div
                key={cake.id}
                className="group bg-white rounded-xl border border-cream-200 overflow-hidden shadow-warm-sm hover:shadow-warm-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream-100">
                    <SharedImage
                      src={cake.imageUrl}
                      alt={cake.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                      <span className={`backdrop-blur-sm text-[9px] sm:text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border shadow-sm ${
                        cake.isAvailable
                          ? "bg-white/95 text-primary-900 border-cream-300"
                          : "bg-red-50/95 text-red-700 border-red-200"
                      }`}>
                        {cake.isAvailable ? "Ready" : "Habis"}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 sm:p-5">
                    <div className="flex items-center gap-1 text-accent-gold text-[10px] sm:text-xs mb-1">
                      <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                      <span className="text-neutral-400 text-[9px] sm:text-[10px] ml-0.5">(5.0)</span>
                    </div>
                    <h3 className="font-display font-semibold text-xs sm:text-base text-primary-900 line-clamp-2 leading-snug">
                      {cake.name}
                    </h3>
                    <p className="text-primary-800 font-bold text-xs sm:text-lg mt-1 font-sans">
                      Rp {cake.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>

                <div className="p-3 sm:p-5 pt-0">
                  <Link
                    href={`/order?cakeId=${cake.id}`}
                    className="w-full btn-primary text-[10px] sm:text-xs tracking-wider uppercase py-2 sm:py-2.5 flex items-center justify-center gap-1 sm:gap-2 shadow-none hover:shadow-warm-sm active:scale-95 transition-all"
                  >
                    <span>Pesan Sekarang</span>
                    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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