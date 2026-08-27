'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { DEFAULT_SETTINGS, SiteSettings } from "@/lib/settings";

export default function KontakPage() {
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
            <Link href="/keunggulan" className="text-neutral-700 hover:text-primary-700 transition">
              Keunggulan
            </Link>
            <Link href="/kontak" className="text-primary-800 font-bold border-b-2 border-accent-gold pb-0.5">
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
            Hubungi & Kunjungi
          </span>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-primary-900 mb-4">
            Informasi Kontak
          </h1>
          <div className="w-16 h-0.5 bg-accent-gold mx-auto mb-3"></div>
          <p className="text-neutral-600 text-sm md:text-base">
            Punya pertanyaan mengenai pesanan khusus, acara besar, atau lokasi toko? Silakan hubungi kami.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Card WhatsApp & Email */}
          <div className="bg-white rounded-2xl border border-cream-300 shadow-warm-sm p-8 space-y-6">
            <h3 className="font-display font-bold text-2xl text-primary-900 border-b border-cream-200 pb-3">
              Layanan Pelanggan
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center text-xl flex-shrink-0">
                  📱
                </div>
                <div>
                  <h4 className="font-semibold text-primary-900">WhatsApp Resmi</h4>
                  <p className="text-neutral-600 text-xs mt-0.5">Respons cepat untuk pemesanan & konfirmasi</p>
                  <a
                    href={`https://wa.me/${settings.whatsappNumber.replace(/^0/, '62')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-700 font-bold text-base hover:underline mt-1 inline-block"
                  >
                    +62 {settings.whatsappNumber}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center text-xl flex-shrink-0">
                  ✉️
                </div>
                <div>
                  <h4 className="font-semibold text-primary-900">Email Resmi</h4>
                  <p className="text-neutral-600 text-xs mt-0.5">Pertanyaan kerjasama & pesanan partai</p>
                  <p className="text-primary-700 font-semibold text-sm mt-1">
                    {settings.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card Lokasi & Jam Operasional */}
          <div className="vintage-frame bg-white rounded-2xl p-8 space-y-6 shadow-warm-sm">
            <h3 className="font-display font-bold text-2xl text-primary-900 border-b border-cream-200 pb-3">
              Lokasi & Jam Buka
            </h3>

            <div className="space-y-4 text-sm text-neutral-700">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center text-xl flex-shrink-0">
                  📍
                </div>
                <div>
                  <h4 className="font-semibold text-primary-900">Alamat Dapur & Pickup</h4>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    {settings.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center text-xl flex-shrink-0">
                  ⏰
                </div>
                <div>
                  <h4 className="font-semibold text-primary-900">Jam Operasional</h4>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    {settings.openingHours}
                  </p>
                  <p className="text-[11px] text-accent-amber font-semibold mt-1">
                    *Pesanan online dapat dilakukan 24 jam
                  </p>
                </div>
              </div>
            </div>
          </div>
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
            <Link href="/keunggulan" className="hover:text-accent-gold">Keunggulan</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}