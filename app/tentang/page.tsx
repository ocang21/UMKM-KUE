'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { DEFAULT_SETTINGS, SiteSettings } from "@/lib/settings";

export default function TentangPage() {
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
              <Link href="/tentang" className="text-primary-800 font-bold border-b-2 border-accent-gold pb-0.5">
                Tentang Kami
              </Link>
              <Link href="/menu" className="text-neutral-700 hover:text-primary-700 transition">
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
                  className="text-primary-800 font-bold py-1.5 px-2 bg-cream-50 rounded-lg"
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
      <main className="container mx-auto max-w-5xl px-3.5 sm:px-6 py-6 sm:py-12 md:py-20 flex-1">
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

        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-14">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-semibold text-accent-amber block mb-1.5 sm:mb-2">
            {settings.aboutBadge}
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold text-primary-900 mb-2 sm:mb-4">
            {settings.aboutTitle}
          </h1>
          <div className="w-12 sm:w-16 h-0.5 bg-accent-gold mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-12 gap-6 sm:gap-10 items-center mb-8 sm:mb-16">
          <div className="md:col-span-7 space-y-3 sm:space-y-5 text-neutral-700 leading-relaxed text-xs sm:text-base">
            <p className="font-display text-base sm:text-xl text-primary-900 font-semibold leading-snug">
              {settings.aboutParagraph1}
            </p>
            <p>
              {settings.aboutParagraph2}
            </p>
          </div>

          <div className="md:col-span-5">
            <div className="relative rounded-2xl bg-white/95 backdrop-blur-sm border border-amber-900/10 shadow-[0_4px_20px_rgb(60,35,18,0.06)] p-5 sm:p-8 text-center">
              <div className="w-10 h-10 sm:w-14 sm:h-14 mx-auto mb-3 rounded-full bg-primary-800 text-cream-50 flex items-center justify-center font-display text-xl sm:text-2xl font-bold border-2 border-accent-gold shadow-2xs">
                “
              </div>
              <p className="font-serif italic text-xs sm:text-base text-primary-900 leading-relaxed mb-3">
                “{settings.aboutQuote}”
              </p>
              <div className="flex items-center justify-center gap-2 my-2 opacity-75">
                <span className="w-6 h-px bg-accent-gold"></span>
                <span className="text-accent-gold text-[10px]">✦</span>
                <span className="w-6 h-px bg-accent-gold"></span>
              </div>
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-accent-amber">{settings.storeName}</p>
              <p className="text-[10px] sm:text-[11px] text-neutral-500 mt-0.5">{settings.address}</p>
            </div>
          </div>
        </div>

        {/* 3 Pillars (Clean Minimalist Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-6 pt-6 sm:pt-10 border-t border-cream-200">
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-amber-900/10 shadow-2xs hover:border-amber-200 transition-colors">
            <span className="w-8 h-8 rounded-lg bg-amber-50 text-accent-amber font-display font-bold text-sm flex items-center justify-center border border-amber-200/60 mb-2">01</span>
            <h3 className="font-display font-bold text-sm sm:text-base text-primary-900 mb-1">{settings.pillar1Title}</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">{settings.pillar1Desc}</p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-amber-900/10 shadow-2xs hover:border-amber-200 transition-colors">
            <span className="w-8 h-8 rounded-lg bg-amber-50 text-accent-amber font-display font-bold text-sm flex items-center justify-center border border-amber-200/60 mb-2">02</span>
            <h3 className="font-display font-bold text-sm sm:text-base text-primary-900 mb-1">{settings.pillar2Title}</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">{settings.pillar2Desc}</p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-amber-900/10 shadow-2xs hover:border-amber-200 transition-colors">
            <span className="w-8 h-8 rounded-lg bg-amber-50 text-accent-amber font-display font-bold text-sm flex items-center justify-center border border-amber-200/60 mb-2">03</span>
            <h3 className="font-display font-bold text-sm sm:text-base text-primary-900 mb-1">{settings.pillar3Title}</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">{settings.pillar3Desc}</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1C120A] text-cream-200 py-10 px-4 border-t border-primary-900">
        <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p>© 2026 {settings.storeName}. Seluruh Hak Cipta Dilindungi.</p>
          <div className="flex gap-6 text-cream-400">
            <Link href="/" className="hover:text-accent-gold">Beranda</Link>
            <Link href="/menu" className="hover:text-accent-gold">Menu</Link>
            <Link href="/keunggulan" className="hover:text-accent-gold">Keunggulan</Link>
            <Link href="/kontak" className="hover:text-accent-gold">Kontak</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}