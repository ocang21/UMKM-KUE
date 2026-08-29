'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { DEFAULT_SETTINGS, SiteSettings } from "@/lib/settings";

export default function KeunggulanPage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setSettings((prev) => ({ ...prev, ...data }));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-cream-50 text-neutral-800 selection:bg-accent-gold selection:text-white flex flex-col justify-between">
      {/* Top Announcement Bar */}
      <div className="bg-primary-900 text-cream-100 text-[11px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-4 text-center tracking-wide sm:tracking-wider font-medium border-b border-primary-800">
        <div className="container mx-auto flex justify-center items-center gap-2">
          <span className="truncate">{settings.announcement}</span>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="border-b border-cream-200 bg-cream-50/90 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 py-2.5 sm:py-3.5">
          <div className="flex justify-between items-center">
            {/* Brand Logo & Name */}
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-accent-gold shadow-warm-sm group-hover:scale-105 transition-transform flex-shrink-0 bg-cream-100">
                <img src="/logo.jpeg" alt={settings.storeName} className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-display font-bold tracking-tight text-primary-900 leading-tight">
                  {settings.storeName}
                </h1>
                <p className="text-[9px] sm:text-[10px] tracking-widest uppercase font-semibold text-accent-gold">
                  {settings.tagline}
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
              <Link href="/menu" className="text-neutral-700 hover:text-primary-700 transition">
                Menu Spesial
              </Link>
              <Link href="/keunggulan" className="text-primary-800 font-bold border-b-2 border-accent-gold pb-0.5">
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
                  className="text-neutral-700 hover:text-primary-800 py-1.5 px-2 font-medium"
                >
                  Menu Spesial
                </Link>
                <Link
                  href="/keunggulan"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-primary-800 font-bold py-1.5 px-2 bg-cream-50 rounded-lg"
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
      <main className="container mx-auto max-w-5xl px-3.5 sm:px-6 py-4 sm:py-10 md:py-16 flex-1">
        {/* Desktop Breadcrumb Only */}
        <div className="hidden md:block mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent-amber hover:text-primary-800 transition"
          >
            <span>←</span>
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-12">
          <div className="inline-flex items-center justify-center gap-1.5 mb-2 px-3 py-0.5 bg-amber-50 rounded-full border border-amber-200/60">
            <span className="text-accent-amber text-xs">✨</span>
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold text-primary-900">
              {settings.advantagesBadge}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold text-primary-950 mb-2 tracking-tight">
            {settings.advantagesTitle}
          </h1>
          <div className="flex items-center justify-center gap-2 my-2.5 opacity-80">
            <span className="w-8 sm:w-16 h-px bg-gradient-to-r from-transparent to-accent-gold"></span>
            <span className="text-accent-gold text-xs">✦</span>
            <span className="w-8 sm:w-16 h-px bg-gradient-to-l from-transparent to-accent-gold"></span>
          </div>
          <p className="text-neutral-600 text-xs sm:text-base max-w-md mx-auto leading-relaxed">
            Komitmen kami untuk selalu memberikan kualitas terbaik di setiap gigitan kue Anda.
          </p>
        </div>

        {/* 3 Keunggulan Cards (Mobile: Sleek Minimalist Cards, Desktop: 3-Column Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-12">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl border border-amber-900/10 shadow-[0_2px_12px_rgba(60,35,18,0.04)] p-4 sm:p-7 flex md:flex-col items-start md:items-center text-left md:text-center gap-3.5 sm:gap-4 hover:shadow-warm-md hover:border-accent-gold/40 transition-all duration-300 group">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-cream-100 to-amber-50 flex items-center justify-center text-primary-800 font-display font-bold text-sm sm:text-lg border border-amber-200/60 shadow-2xs flex-shrink-0 group-hover:scale-105 transition-transform">
              01
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-bold text-sm sm:text-lg text-primary-900 mb-1 sm:mb-2 group-hover:text-primary-700 transition-colors">
                {settings.feature1Title}
              </h3>
              <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                {settings.feature1Desc}
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl border border-amber-900/10 shadow-[0_2px_12px_rgba(60,35,18,0.04)] p-4 sm:p-7 flex md:flex-col items-start md:items-center text-left md:text-center gap-3.5 sm:gap-4 hover:shadow-warm-md hover:border-accent-gold/40 transition-all duration-300 group">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-cream-100 to-amber-50 flex items-center justify-center text-primary-800 font-display font-bold text-sm sm:text-lg border border-amber-200/60 shadow-2xs flex-shrink-0 group-hover:scale-105 transition-transform">
              02
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-bold text-sm sm:text-lg text-primary-900 mb-1 sm:mb-2 group-hover:text-primary-700 transition-colors">
                {settings.feature2Title}
              </h3>
              <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                {settings.feature2Desc}
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl border border-amber-900/10 shadow-[0_2px_12px_rgba(60,35,18,0.04)] p-4 sm:p-7 flex md:flex-col items-start md:items-center text-left md:text-center gap-3.5 sm:gap-4 hover:shadow-warm-md hover:border-accent-gold/40 transition-all duration-300 group">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-cream-100 to-amber-50 flex items-center justify-center text-primary-800 font-display font-bold text-sm sm:text-lg border border-amber-200/60 shadow-2xs flex-shrink-0 group-hover:scale-105 transition-transform">
              03
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-bold text-sm sm:text-lg text-primary-900 mb-1 sm:mb-2 group-hover:text-primary-700 transition-colors">
                {settings.feature3Title}
              </h3>
              <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                {settings.feature3Desc}
              </p>
            </div>
          </div>
        </div>

        {/* Certificate / Quality Box (Minimalis & Elegan) */}
        <div className="relative rounded-3xl bg-white border border-amber-900/10 p-5 sm:p-8 text-center max-w-2xl mx-auto shadow-[0_4px_20px_rgba(60,35,18,0.04)]">
          <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2.5 rounded-full bg-cream-100 text-primary-800 flex items-center justify-center text-lg sm:text-xl shadow-2xs border border-amber-200/60">
            🛡️
          </div>
          <h3 className="font-display font-bold text-lg sm:text-2xl text-primary-950 mb-1.5">{settings.halalBoxTitle}</h3>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto mb-5 leading-relaxed">
            {settings.halalBoxDesc}
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center justify-center gap-2 btn-primary text-xs uppercase tracking-wider py-2.5 px-6 sm:px-8 shadow-warm-md hover:scale-105 active:scale-95 transition-all"
          >
            <span>Lihat Menu Kami</span>
            <span className="text-sm">➔</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#140D06] text-cream-200 pt-8 pb-20 md:pb-10 px-3.5 sm:px-6 border-t border-amber-900/30 mt-10">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-center sm:text-left">
            <div>
              <p className="font-display font-bold text-cream-50 text-sm">{settings.storeName}</p>
              <p className="text-cream-400/60 text-[11px] mt-0.5">© 2026 Seluruh Hak Cipta Dilindungi.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 text-[11px]">
              <Link href="/" className="px-2.5 py-1 rounded-md bg-[#1E130A] border border-amber-900/40 text-cream-300 hover:text-accent-gold transition">Beranda</Link>
              <Link href="/tentang" className="px-2.5 py-1 rounded-md bg-[#1E130A] border border-amber-900/40 text-cream-300 hover:text-accent-gold transition">Tentang Kami</Link>
              <Link href="/menu" className="px-2.5 py-1 rounded-md bg-[#1E130A] border border-amber-900/40 text-cream-300 hover:text-accent-gold transition">Menu</Link>
              <Link href="/kontak" className="px-2.5 py-1 rounded-md bg-[#1E130A] border border-amber-900/40 text-cream-300 hover:text-accent-gold transition">Kontak</Link>
              <Link href="/order" className="px-2.5 py-1 rounded-md bg-amber-500/20 border border-accent-gold/40 text-accent-gold font-semibold hover:text-white transition">Pesan ➔</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}