'use client';

// Import Link dari Next.js untuk navigasi client-side
import Link from "next/link";
import SharedImage from "@/components/SharedImage";
import { useState, useEffect, useRef } from "react";
import { SAMPLE_20_CAKES, CakeItem } from "@/lib/sampleCakes";
import { DEFAULT_SETTINGS, SiteSettings } from "@/lib/settings";

// Hook Counter Animasi Angka Ringan (Native requestAnimationFrame, 0 External Library)
function useCountUp(end: number, duration: number = 1800, decimals: number = 0, startTrigger: boolean = true) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startTrigger) return;

    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Easing outExpo agar gerakan angka cepat di awal lalu melambat halus saat mendekati angka akhir
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = easeOut * end;
      
      setCount(decimals > 0 ? parseFloat(currentVal.toFixed(decimals)) : Math.floor(currentVal));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [end, duration, decimals, startTrigger]);

  return count;
}

// Komponen utama Landing Page bergaya Warm Artisan Bakery
export default function HomePage() {
  const [cakes, setCakes] = useState<CakeItem[]>(SAMPLE_20_CAKES);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("semua");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Intersection Observer untuk memicu animasi saat user melihat section statistik
  const [hasStartedCount, setHasStartedCount] = useState(false);
  const statsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStartedCount(true);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Angka Counter yang menganimasi dari 0 ke target
  const countCustomers = useCountUp(100, 1600, 0, hasStartedCount);
  const countVariants = useCountUp(50, 1600, 0, hasStartedCount);
  const countQuality = useCountUp(100, 1600, 0, hasStartedCount);
  const countRating = useCountUp(5.0, 1600, 1, hasStartedCount);

  useEffect(() => {
    fetchCakes();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings((prev) => ({ ...prev, ...data }));
      }
    } catch (e) {}
  };

  const fetchCakes = async () => {
    try {
      const res = await fetch("/api/cakes/available");
      if (!res.ok) {
        return;
      }
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setCakes(data);
      }
    } catch (error) {
      console.log("Using sample cakes for display");
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    { id: "semua", name: "Semua Menu" },
    { id: "kue-basah", name: "Kue Basah & Chiffon" },
    { id: "pastry", name: "Croissant & Pastry" },
    { id: "roti", name: "Roti & Donat" },
    { id: "tart", name: "Tart & Cake" },
    { id: "kue-kering", name: "Kue Kering (Toples)" },
  ];

  const filteredCakes = (selectedCategory === "semua"
    ? cakes
    : cakes.filter(c => c.category === selectedCategory || !c.category)
  ).slice(0, 5);

  return (
    <div className="min-h-screen bg-cream-50 text-neutral-800 selection:bg-accent-gold selection:text-white">
      {/* Top Announcement Bar */}
      <div className="bg-primary-900 text-cream-100 text-xs py-2 px-4 text-center tracking-wider font-medium border-b border-primary-800">
        <div className="container mx-auto flex justify-center items-center gap-3">
          <span>{settings.announcement}</span>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="border-b border-cream-200 bg-cream-50/90 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 py-3.5">
          <div className="flex justify-between items-center">
            {/* Brand Logo & Name */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-accent-gold shadow-warm-sm group-hover:scale-105 transition-transform flex-shrink-0 bg-cream-100">
                <img
                  src="/logo.jpeg"
                  alt={settings.storeName}
                  className="w-full h-full object-cover"
                />
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
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
              <Link
                href="/tentang"
                className="text-neutral-700 hover:text-primary-700 transition"
              >
                Tentang Kami
              </Link>
              <Link
                href="/menu"
                className="text-neutral-700 hover:text-primary-700 transition"
              >
                Menu Spesial
              </Link>
              <Link
                href="/keunggulan"
                className="text-neutral-700 hover:text-primary-700 transition"
              >
                Keunggulan
              </Link>
              <Link
                href="/kontak"
                className="text-neutral-700 hover:text-primary-700 transition"
              >
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
              <Link
                href="/order"
                className="btn-primary text-xs uppercase tracking-wider py-2 px-5"
              >
                Pesan Sekarang
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-primary-900 rounded-lg focus:outline-none"
              aria-label="Toggle Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Dropdown Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-3 pt-4 pb-2 border-t border-cream-200 animate-in fade-in duration-200">
              <div className="flex flex-col gap-3 text-sm">
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

      {/* Hero Section (Centerpiece Framed Card with Pure CSS/SVG Artisan Bakery Illustrations - Ultra Lightweight & Instant Load) */}
      <section className="relative py-12 md:py-20 px-4 bg-cream-100 bg-artisan-dots overflow-hidden min-h-[640px] flex items-center justify-center">
        {/* Subtle Decorative Ambient Glows */}
        <div className="absolute -top-16 -left-16 w-80 h-80 rounded-full bg-accent-goldLight/20 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-primary-200/30 blur-3xl pointer-events-none"></div>

        {/* Floating CSS/SVG Artisan Pastry Cards (Automatic Continuous Floating Motion) */}
        
        {/* Top-Left: Warm Coffee & Latte Art */}
        <div className="hidden lg:block absolute top-6 left-6 xl:left-12 z-10 animate-float-card-1 pointer-events-auto">
          <div className="w-40 h-40 xl:w-48 xl:h-48 rounded-2xl bg-white/95 backdrop-blur-md shadow-warm-lg border border-cream-300 p-3 hover:scale-105 transition-transform duration-300 flex flex-col items-center justify-center group cursor-default">
            <div className="w-20 h-20 xl:w-24 xl:h-24 rounded-full bg-gradient-to-br from-cream-100 to-cream-200 flex items-center justify-center shadow-inner border border-cream-300 mb-2 group-hover:scale-110 transition-transform relative">
              {/* Coffee Cup SVG */}
              <svg className="w-12 h-12 text-primary-700" viewBox="0 0 64 64" fill="none" stroke="currentColor">
                <path d="M12 24h32v18a12 12 0 01-12 12H24a12 12 0 01-12-12V24z" fill="#FAF6F0" stroke="#56351F" strokeWidth="2.5" />
                <path d="M44 28h6a6 6 0 016 6v2a6 6 0 01-6 6h-6" stroke="#56351F" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M8 54h40" stroke="#C89F6E" strokeWidth="3" strokeLinecap="round" />
                <g className="animate-steam">
                  <path d="M22 14c0-2 2-4 2-6M28 14c0-2 2-4 2-6M34 14c0-2 2-4 2-6" stroke="#C89F6E" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 3" />
                </g>
                <ellipse cx="28" cy="28" rx="12" ry="4" fill="#8B5E3C" />
                <path d="M26 28c1-1 3-1 4 0" stroke="#FAF6F0" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary-900">Morning Coffee</span>
            <span className="text-[9px] text-accent-amber font-semibold">Teman Santap Kue</span>
          </div>
        </div>

        {/* Top-Right: Golden Croissant & Fresh Pastry */}
        <div className="hidden lg:block absolute top-6 right-6 xl:right-12 z-10 animate-float-card-2 pointer-events-auto">
          <div className="w-44 h-44 xl:w-52 xl:h-52 rounded-2xl bg-white/95 backdrop-blur-md shadow-warm-lg border border-cream-300 p-3 hover:scale-105 transition-transform duration-300 flex flex-col items-center justify-center group cursor-default">
            <div className="w-20 h-20 xl:w-24 xl:h-24 rounded-full bg-gradient-to-br from-amber-50 to-orange-100/80 flex items-center justify-center shadow-inner border border-amber-200 mb-2 group-hover:scale-110 transition-transform">
              {/* Croissant SVG */}
              <svg className="w-14 h-14" viewBox="0 0 64 64" fill="none">
                <path d="M10 38c2-8 12-18 22-18s20 10 22 18c-4 6-12 10-22 10s-18-4-22-10z" fill="#D5BC9F" stroke="#6F472B" strokeWidth="2" />
                <path d="M16 34c3-6 9-12 16-12s13 6 16 12" stroke="#8B5E3C" strokeWidth="2" strokeLinecap="round" />
                <path d="M24 22c3 4 5 12 5 18M40 22c-3 4-5 12-5 18" stroke="#56351F" strokeWidth="2" strokeLinecap="round" />
                <circle cx="32" cy="20" r="1.5" fill="#C89F6E" />
                <circle cx="20" cy="28" r="1" fill="#C89F6E" />
                <circle cx="44" cy="28" r="1" fill="#C89F6E" />
              </svg>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary-900">Golden Croissant</span>
            </div>
            <span className="text-[9px] text-green-700 font-semibold bg-green-50 px-2 py-0.5 rounded-full border border-green-200 mt-0.5 animate-pulse">Fresh 06:00 WITA</span>
          </div>
        </div>

        {/* Bottom-Left: Gourmet Cake Slice */}
        <div className="hidden lg:block absolute bottom-6 left-6 xl:left-12 z-10 animate-float-card-3 pointer-events-auto">
          <div className="w-44 h-44 xl:w-52 xl:h-52 rounded-2xl bg-white/95 backdrop-blur-md shadow-warm-lg border border-cream-300 p-3 hover:scale-105 transition-transform duration-300 flex flex-col items-center justify-center group cursor-default">
            <div className="w-20 h-20 xl:w-24 xl:h-24 rounded-full bg-gradient-to-br from-rose-50 to-amber-50 flex items-center justify-center shadow-inner border border-rose-200/60 mb-2 group-hover:scale-110 transition-transform">
              {/* Cake Slice SVG */}
              <svg className="w-13 h-13" viewBox="0 0 64 64" fill="none">
                <path d="M12 42l36-12v14l-36 6V42z" fill="#6F472B" stroke="#3D2516" strokeWidth="2" />
                <path d="M12 36l36-12v6l-36 12V36z" fill="#F4ECE1" />
                <path d="M12 30l36-12v6l-36 12V30z" fill="#8B5E3C" />
                <path d="M12 30l24-14 24 4-36 14-12-4z" fill="#FAF6F0" stroke="#3D2516" strokeWidth="2" />
                <circle cx="34" cy="18" r="4" fill="#C24609" stroke="#7A2F0D" strokeWidth="1.5" />
                <path d="M36 15c2-3 4-3 6-4" stroke="#56351F" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary-900">Gourmet Cake</span>
            <span className="text-[9px] text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 mt-0.5">⭐ Best Seller</span>
          </div>
        </div>

        {/* Bottom-Right: Traditional Artisan Loaf */}
        <div className="hidden lg:block absolute bottom-6 right-6 xl:right-12 z-10 animate-float-card-4 pointer-events-auto">
          <div className="w-40 h-40 xl:w-48 xl:h-48 rounded-2xl bg-white/95 backdrop-blur-md shadow-warm-lg border border-cream-300 p-3 hover:scale-105 transition-transform duration-300 flex flex-col items-center justify-center group cursor-default">
            <div className="w-20 h-20 xl:w-24 xl:h-24 rounded-full bg-gradient-to-br from-cream-100 to-amber-100/70 flex items-center justify-center shadow-inner border border-cream-300 mb-2 group-hover:scale-110 transition-transform">
              {/* Bread Loaf SVG */}
              <svg className="w-13 h-13" viewBox="0 0 64 64" fill="none">
                <path d="M14 36c0-10 10-18 20-18s18 8 18 18c0 8-8 12-18 12s-20-4-20-12z" fill="#D5BC9F" stroke="#56351F" strokeWidth="2.5" />
                <path d="M22 28l4 8M32 24v12M42 28l-4 8" stroke="#FAF6F0" strokeWidth="2" strokeLinecap="round" />
                <circle cx="28" cy="42" r="1" fill="#8B5E3C" />
                <circle cx="36" cy="40" r="1" fill="#8B5E3C" />
              </svg>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary-900">Artisan Bread</span>
            <span className="text-[9px] text-accent-amber font-semibold">100% Homemade</span>
          </div>
        </div>

        <div className="container mx-auto max-w-4xl relative z-20">
          {/* Framed Centerpiece Box */}
          <div className="vintage-frame rounded-2xl text-center bg-white/95 backdrop-blur-md shadow-warm-xl p-6 sm:p-10 md:p-12 animate-fade-in-up">
            {/* Top Badge Subhead */}
            <div className="inline-flex items-center justify-center gap-2 mb-4">
              <span className="w-6 sm:w-10 h-[1px] bg-accent-gold"></span>
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-accent-amber">
                {settings.heroBadge}
              </span>
              <span className="w-6 sm:w-10 h-[1px] bg-accent-gold"></span>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-900 tracking-tight leading-[1.15] mb-5">
              {settings.heroTitle} <br />
              <span className="italic font-normal text-primary-700">{settings.heroTitleItalic}</span>
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-base md:text-lg text-neutral-600 max-w-xl mx-auto mb-8 font-sans font-normal leading-relaxed">
              {settings.heroDescription}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-8">
              <Link
                href="/order"
                className="btn-primary w-full sm:w-auto text-xs sm:text-sm uppercase tracking-wider px-8 py-3.5 shadow-warm-md hover:scale-105 active:scale-95 transition-all duration-200"
              >
                Pesan Sekarang
              </Link>
              <Link
                href="/tentang"
                className="btn-outline w-full sm:w-auto text-xs sm:text-sm uppercase tracking-wider px-8 py-3.5 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                Cerita Kami
              </Link>
            </div>

            {/* Mobile Pastry Showcase (Pure CSS/SVG, Instant Load) */}
            <div className="lg:hidden grid grid-cols-3 gap-2.5 mb-6 pt-4 border-t border-cream-200">
              <div className="p-3 bg-cream-50 rounded-xl border border-cream-200 flex flex-col items-center text-center">
                <span className="text-2xl mb-1">🥐</span>
                <span className="text-[10px] font-bold text-primary-900">Croissant</span>
                <span className="text-[9px] text-neutral-500">Fresh Oven</span>
              </div>
              <div className="p-3 bg-cream-50 rounded-xl border border-cream-200 flex flex-col items-center text-center">
                <span className="text-2xl mb-1">🍰</span>
                <span className="text-[10px] font-bold text-primary-900">Kue Tart</span>
                <span className="text-[9px] text-neutral-500">Kualitas Prima</span>
              </div>
              <div className="p-3 bg-cream-50 rounded-xl border border-cream-200 flex flex-col items-center text-center">
                <span className="text-2xl mb-1">🍞</span>
                <span className="text-[10px] font-bold text-primary-900">Roti Manis</span>
                <span className="text-[9px] text-neutral-500">Tanpa Pengawet</span>
              </div>
            </div>

            {/* Badges / Stamp Highlights */}
            <div className="pt-6 border-t border-cream-200 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-1 sm:p-2">
                <div className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-primary-900">100% Homemade</div>
                <div className="text-[10px] sm:text-[11px] text-neutral-500 mt-0.5">Resep Warisan Asli</div>
              </div>
              <div className="p-1 sm:p-2">
                <div className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-primary-900">Tanpa Pengawet</div>
                <div className="text-[10px] sm:text-[11px] text-neutral-500 mt-0.5">Bahan Alami Pilihan</div>
              </div>
              <div className="p-1 sm:p-2">
                <div className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-primary-900">Higienis & Halal</div>
                <div className="text-[10px] sm:text-[11px] text-neutral-500 mt-0.5">Standar Bersih Tinggi</div>
              </div>
              <div className="p-1 sm:p-2">
                <div className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-primary-900">Fresh Daily</div>
                <div className="text-[10px] sm:text-[11px] text-neutral-500 mt-0.5">Dipanggang Tiap Pagi</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Strip (Animated Roll-Up on Scroll) */}
      <section ref={statsRef} className="bg-cream-100 border-y border-cream-200 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="group cursor-default">
              <div className="text-3xl md:text-4xl font-display font-bold text-primary-900 group-hover:scale-105 transition-transform duration-200">
                {countCustomers}+
              </div>
              <p className="text-xs uppercase tracking-wider text-neutral-600 mt-1 font-medium">Pelanggan Puas</p>
            </div>
            <div className="group cursor-default">
              <div className="text-3xl md:text-4xl font-display font-bold text-primary-900 group-hover:scale-105 transition-transform duration-200">
                {countVariants}+
              </div>
              <p className="text-xs uppercase tracking-wider text-neutral-600 mt-1 font-medium">Varian Kue</p>
            </div>
            <div className="group cursor-default">
              <div className="text-3xl md:text-4xl font-display font-bold text-primary-900 group-hover:scale-105 transition-transform duration-200">
                {countQuality}%
              </div>
              <p className="text-xs uppercase tracking-wider text-neutral-600 mt-1 font-medium">Bahan Premium</p>
            </div>
            <div className="group cursor-default">
              <div className="text-3xl md:text-4xl font-display font-bold text-primary-900 group-hover:scale-105 transition-transform duration-200">
                {countRating.toFixed(1)} ★
              </div>
              <p className="text-xs uppercase tracking-wider text-neutral-600 mt-1 font-medium">Rating Rasa</p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu / Product Catalog Section (Inspired by Reference #2 & #4) */}
      <section id="menu" className="py-16 md:py-24 px-4 bg-cream-50">
        <div className="container mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-accent-amber block mb-2">
              Koleksi Terbaik Kami
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-900 mb-4">
              Menu Kue Pilihan
            </h2>
            <div className="w-12 h-0.5 bg-accent-gold mx-auto mb-4"></div>
            <p className="text-neutral-600 text-sm md:text-base leading-relaxed">
              Setiap kue dipanggang dengan ketelitian dan rasa cinta, siap melengkapi santap sore dan perayaan Anda.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex justify-center gap-2 mb-10">
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

          {/* Menu Catalog Grid */}
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-2 border-primary-700 border-t-transparent"></div>
              <p className="mt-4 text-neutral-600 text-sm">Menyiapkan menu lezat...</p>
            </div>
          ) : cakes.length === 0 ? (
            <div className="text-center py-16 card-artisan max-w-md mx-auto p-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cream-100 flex items-center justify-center text-primary-700 font-display text-2xl font-bold border border-cream-300">
                🧁
              </div>
              <h3 className="text-xl font-display font-bold text-primary-900 mb-2">Menu Segera Hadir</h3>
              <p className="text-neutral-600 text-sm">
                Kami sedang menyiapkan kue-kue fresh dari oven untuk Anda. Silakan cek kembali nanti.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCakes.map((cake) => (
                <div
                  key={cake.id}
                  className="group bg-white rounded-xl border border-cream-200 overflow-hidden shadow-warm-sm hover:shadow-warm-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Cake Image Container */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream-100">
                    <SharedImage
                      src={cake.imageUrl}
                      alt={cake.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="bg-white/95 backdrop-blur-sm text-primary-900 text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border border-cream-300 shadow-sm">
                        {cake.isAvailable ? "Ready" : "Habis"}
                      </span>
                    </div>
                  </div>

                  {/* Cake Info */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-accent-gold text-xs mb-1.5">
                        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                        <span className="text-neutral-400 text-[10px] ml-1">(5.0)</span>
                      </div>
                      <h3 className="font-display font-semibold text-base text-primary-900 group-hover:text-primary-700 transition line-clamp-1">
                        {cake.name}
                      </h3>
                      <p className="text-primary-700 font-bold text-lg mt-1 font-sans">
                        Rp {cake.price.toLocaleString("id-ID")}
                      </p>
                    </div>

                    {/* Order Button */}
                    <div className="mt-4 pt-4 border-t border-cream-100">
                      <Link
                        href={`/order?cakeId=${cake.id}`}
                        className="w-full btn-primary text-xs tracking-wider uppercase py-2.5 flex items-center justify-center gap-2"
                      >
                        <span>Pesan Menu</span>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tombol Lihat Semua Menu Pilihan */}
          <div className="mt-12 text-center">
            <Link
              href="/menu"
              className="inline-flex items-center gap-3 bg-white border-2 border-primary-800 text-primary-900 hover:bg-primary-800 hover:text-cream-50 font-bold px-8 py-3.5 rounded-full shadow-warm-md hover:shadow-warm-lg transition-all duration-300 text-xs uppercase tracking-widest group"
            >
              <span>Lihat Semua Menu Pilihan (20+ Varian)</span>
              <svg
                className="w-4 h-4 text-accent-amber group-hover:text-cream-50 group-hover:translate-x-1 transition-all"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Story & Craftsmanship Section (Inspired by Reference #3) */}
      <section id="tentang" className="py-16 md:py-24 px-4 bg-cream-100 border-t border-cream-200">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-12 gap-10 items-center">
            {/* Left Column: Story Content */}
            <div className="md:col-span-7">
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-accent-amber block mb-2">
                {settings.aboutBadge}
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-900 mb-6 leading-tight">
                {settings.aboutTitle}
              </h2>
              <p className="text-neutral-700 text-sm md:text-base leading-relaxed mb-4">
                {settings.aboutParagraph1}
              </p>
              <p className="text-neutral-700 text-sm md:text-base leading-relaxed mb-8">
                {settings.aboutParagraph2}
              </p>

              {/* Numbered Features List */}
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-3 bg-white/70 rounded-lg border border-cream-200">
                  <span className="text-accent-amber font-display font-bold text-lg">01</span>
                  <div>
                    <h4 className="font-semibold text-primary-900 text-sm">{settings.pillar1Title}</h4>
                    <p className="text-xs text-neutral-600 mt-0.5">{settings.pillar1Desc}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-3 bg-white/70 rounded-lg border border-cream-200">
                  <span className="text-accent-amber font-display font-bold text-lg">02</span>
                  <div>
                    <h4 className="font-semibold text-primary-900 text-sm">{settings.pillar2Title}</h4>
                    <p className="text-xs text-neutral-600 mt-0.5">{settings.pillar2Desc}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-3 bg-white/70 rounded-lg border border-cream-200">
                  <span className="text-accent-amber font-display font-bold text-lg">03</span>
                  <div>
                    <h4 className="font-semibold text-primary-900 text-sm">{settings.pillar3Title}</h4>
                    <p className="text-xs text-neutral-600 mt-0.5">{settings.pillar3Desc}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Decorative Quote Box (100% CSS/SVG, Instant Load) */}
            <div className="md:col-span-5">
              <div className="vintage-frame bg-cream-50 text-center py-10 px-8 rounded-xl shadow-warm-md">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary-800 text-cream-50 flex items-center justify-center font-display text-2xl font-bold border-2 border-accent-gold shadow-warm-sm">
                  “
                </div>
                <p className="font-display italic text-base sm:text-lg text-primary-900 leading-relaxed mb-4">
                  “{settings.aboutQuote}”
                </p>
                <div className="w-10 h-0.5 bg-accent-gold mx-auto mb-3"></div>
                <div className="text-xs font-semibold tracking-widest uppercase text-accent-amber">
                  {settings.storeName}
                </div>
                <div className="text-[11px] text-neutral-500 mt-0.5">Dedikasi Rasa Sejak 2026</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="keunggulan" className="py-16 md:py-24 px-4 bg-cream-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-accent-amber block mb-2">
              {settings.advantagesBadge}
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-900 mb-3">
              {settings.advantagesTitle}
            </h2>
            <div className="w-12 h-0.5 bg-accent-gold mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-artisan p-8 text-center bg-white">
              <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-cream-100 flex items-center justify-center text-primary-800 text-xl font-display font-bold border border-cream-300">
                01
              </div>
              <h3 className="font-display font-bold text-lg text-primary-900 mb-2">{settings.feature1Title}</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                {settings.feature1Desc}
              </p>
            </div>

            <div className="card-artisan p-8 text-center bg-white">
              <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-cream-100 flex items-center justify-center text-primary-800 text-xl font-display font-bold border border-cream-300">
                02
              </div>
              <h3 className="font-display font-bold text-lg text-primary-900 mb-2">{settings.feature2Title}</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                {settings.feature2Desc}
              </p>
            </div>

            <div className="card-artisan p-8 text-center bg-white">
              <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-cream-100 flex items-center justify-center text-primary-800 text-xl font-display font-bold border border-cream-300">
                03
              </div>
              <h3 className="font-display font-bold text-lg text-primary-900 mb-2">{settings.feature3Title}</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                {settings.feature3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Strip Section */}
      <section className="py-16 md:py-20 px-4 bg-primary-900 text-cream-50 relative overflow-hidden border-y border-primary-800">
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-accent-gold block mb-3">
            Pesan untuk Momen Bahagia
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 tracking-tight">
            Siap Menikmati Kue Segar Hari Ini?
          </h2>
          <p className="text-cream-200 text-sm md:text-base mb-8 max-w-xl mx-auto font-sans leading-relaxed">
            Pesan sekarang secara online dan nikmati kelezatan kue buatan tangan yang hangat dan lembut bersama keluarga.
          </p>
          <Link
            href="/order"
            className="inline-flex items-center gap-2 bg-cream-100 text-primary-900 font-semibold px-8 py-3.5 rounded-full hover:bg-white transition-colors shadow-warm-lg text-sm uppercase tracking-wider"
          >
            <span>Pesan Sekarang Melalui Formulir</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer Section */}
      <footer id="kontak" className="bg-[#1C120A] text-cream-200 py-12 md:py-16 px-4 border-t border-primary-900">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand Info */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-accent-gold flex-shrink-0 bg-cream-100">
                  <img
                    src="/logo.jpeg"
                    alt={settings.storeName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-cream-50">{settings.storeName}</h3>
                  <p className="text-[10px] uppercase tracking-widest text-accent-gold">{settings.tagline}</p>
                </div>
              </div>
              <p className="text-cream-300/80 text-xs leading-relaxed max-w-sm mb-4">
                Menghadirkan kue tradisional dan modern berkualitas tinggi dengan bahan alami terbaik untuk setiap momen kebersamaan Anda.
              </p>
              <div className="text-xs text-cream-300/70 space-y-1">
                <p>📍 Lokasi: {settings.address}</p>
                <p>⏰ Buka: {settings.openingHours}</p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-display font-semibold text-sm text-cream-50 uppercase tracking-wider mb-4">
                Navigasi
              </h4>
              <ul className="space-y-2 text-xs text-cream-300/80">
                <li><Link href="/tentang" className="hover:text-accent-gold transition">Tentang Kami</Link></li>
                <li><Link href="/menu" className="hover:text-accent-gold transition">Menu Pilihan</Link></li>
                <li><Link href="/keunggulan" className="hover:text-accent-gold transition">Keunggulan</Link></li>
                <li><Link href="/kontak" className="hover:text-accent-gold transition">Kontak</Link></li>
                <li><Link href="/order" className="hover:text-accent-gold transition">Form Pemesanan</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-display font-semibold text-sm text-cream-50 uppercase tracking-wider mb-4">
                Hubungi Kami
              </h4>
              <ul className="space-y-2 text-xs text-cream-300/80">
                <li>
                  <span className="block text-[10px] text-cream-400 uppercase">WhatsApp</span>
                  <a href={`https://wa.me/${settings.whatsappNumber.replace(/^0/, '62')}`} target="_blank" rel="noopener noreferrer" className="hover:text-accent-gold transition">
                    {settings.whatsappNumber}
                  </a>
                </li>
                <li>
                  <span className="block text-[10px] text-cream-400 uppercase">Email</span>
                  <span className="text-cream-300">{settings.email}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-primary-900/60 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-cream-400/60">
            <p>© 2026 {settings.storeName}. Seluruh Hak Cipta Dilindungi.</p>
            <p className="text-[11px] tracking-wide">Dibuat dengan penuh cinta untuk UMKM Indonesia.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
