'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { DEFAULT_SETTINGS, SiteSettings } from "@/lib/settings";

export default function TentangPage() {
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

          <div className="flex items-center gap-3">
            <Link href="/order" className="btn-primary text-xs uppercase tracking-wider py-2 px-5">
              Pesan Sekarang
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto max-w-5xl px-4 py-12 md:py-20 flex-1">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-accent-amber block mb-2">
            {settings.aboutBadge}
          </span>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-primary-900 mb-4">
            {settings.aboutTitle}
          </h1>
          <div className="w-16 h-0.5 bg-accent-gold mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-12 gap-10 items-center mb-16">
          <div className="md:col-span-7 space-y-5 text-neutral-700 leading-relaxed text-sm md:text-base">
            <p className="font-display text-xl text-primary-900 font-semibold leading-snug">
              {settings.aboutParagraph1}
            </p>
            <p>
              {settings.aboutParagraph2}
            </p>
          </div>

          <div className="md:col-span-5">
            <div className="vintage-frame bg-white rounded-2xl p-8 text-center shadow-warm-lg">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary-800 text-cream-50 flex items-center justify-center font-display text-2xl font-bold border-2 border-accent-gold shadow-warm-sm">
                “
              </div>
              <p className="font-display italic text-base text-primary-900 leading-relaxed mb-4">
                “{settings.aboutQuote}”
              </p>
              <div className="w-12 h-0.5 bg-accent-gold mx-auto mb-3"></div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-amber">{settings.storeName}</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">{settings.address}</p>
            </div>
          </div>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-cream-200">
          <div className="bg-white p-6 rounded-xl border border-cream-300 shadow-warm-sm">
            <span className="text-accent-amber font-display font-bold text-2xl mb-2 block">01</span>
            <h3 className="font-display font-bold text-base text-primary-900 mb-1">{settings.pillar1Title}</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">{settings.pillar1Desc}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-cream-300 shadow-warm-sm">
            <span className="text-accent-amber font-display font-bold text-2xl mb-2 block">02</span>
            <h3 className="font-display font-bold text-base text-primary-900 mb-1">{settings.pillar2Title}</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">{settings.pillar2Desc}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-cream-300 shadow-warm-sm">
            <span className="text-accent-amber font-display font-bold text-2xl mb-2 block">03</span>
            <h3 className="font-display font-bold text-base text-primary-900 mb-1">{settings.pillar3Title}</h3>
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