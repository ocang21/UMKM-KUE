'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { DEFAULT_SETTINGS, SiteSettings } from "@/lib/settings";

export default function KeunggulanPage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

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
      <div className="bg-primary-900 text-cream-100 text-xs py-2 px-4 text-center tracking-wider font-medium border-b border-primary-800">
        <div className="container mx-auto flex justify-center items-center gap-3">
          <span>{settings.announcement}</span>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="border-b border-cream-200 bg-cream-50/90 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 py-3.5 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-accent-gold shadow-warm-sm group-hover:scale-105 transition-transform flex-shrink-0 bg-cream-100">
              <img src="/logo.jpeg" alt={settings.storeName} className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold tracking-tight text-primary-900 leading-tight">
                {settings.storeName}
              </h1>
              <p className="text-[10px] tracking-widest uppercase font-semibold text-accent-gold">
                {settings.tagline}
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

          <div className="flex items-center gap-3">
            <Link href="/order" className="btn-primary text-xs uppercase tracking-wider py-2 px-5">
              Pesan Sekarang
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto max-w-6xl px-4 py-12 md:py-20 flex-1">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-accent-amber block mb-2">
            {settings.advantagesBadge}
          </span>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-primary-900 mb-4">
            {settings.advantagesTitle}
          </h1>
          <div className="w-16 h-0.5 bg-accent-gold mx-auto mb-3"></div>
          <p className="text-neutral-600 text-sm md:text-base">
            Komitmen kami untuk selalu memberikan yang terbaik bagi setiap pelanggan tercinta.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="card-artisan p-8 bg-white text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-cream-100 flex items-center justify-center text-primary-800 text-2xl font-display font-bold border border-cream-300">
              01
            </div>
            <h3 className="font-display font-bold text-xl text-primary-900 mb-3">{settings.feature1Title}</h3>
            <p className="text-neutral-600 text-sm leading-relaxed">
              {settings.feature1Desc}
            </p>
          </div>

          <div className="card-artisan p-8 bg-white text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-cream-100 flex items-center justify-center text-primary-800 text-2xl font-display font-bold border border-cream-300">
              02
            </div>
            <h3 className="font-display font-bold text-xl text-primary-900 mb-3">{settings.feature2Title}</h3>
            <p className="text-neutral-600 text-sm leading-relaxed">
              {settings.feature2Desc}
            </p>
          </div>

          <div className="card-artisan p-8 bg-white text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-cream-100 flex items-center justify-center text-primary-800 text-2xl font-display font-bold border border-cream-300">
              03
            </div>
            <h3 className="font-display font-bold text-xl text-primary-900 mb-3">{settings.feature3Title}</h3>
            <p className="text-neutral-600 text-sm leading-relaxed">
              {settings.feature3Desc}
            </p>
          </div>
        </div>

        {/* Certificate / Quality Box */}
        <div className="vintage-frame bg-cream-100 rounded-2xl p-8 text-center max-w-3xl mx-auto">
          <h3 className="font-display font-bold text-2xl text-primary-900 mb-2">{settings.halalBoxTitle}</h3>
          <p className="text-xs md:text-sm text-neutral-600 max-w-lg mx-auto mb-6">
            {settings.halalBoxDesc}
          </p>
          <Link href="/menu" className="btn-primary text-xs uppercase tracking-wider py-3 px-8">
            Lihat Menu Kami
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1C120A] text-cream-200 py-10 px-4 border-t border-primary-900 mt-16">
        <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p>© 2026 {settings.storeName}. Seluruh Hak Cipta Dilindungi.</p>
          <div className="flex gap-6 text-cream-400">
            <Link href="/" className="hover:text-accent-gold">Beranda</Link>
            <Link href="/tentang" className="hover:text-accent-gold">Tentang Kami</Link>
            <Link href="/menu" className="hover:text-accent-gold">Menu</Link>
            <Link href="/kontak" className="hover:text-accent-gold">Kontak</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}