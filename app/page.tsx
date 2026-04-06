// Directive untuk menandakan komponen ini adalah Client Component
// Diperlukan karena menggunakan hooks dan interaksi client-side
'use client';

// Import Link dari Next.js untuk navigasi client-side tanpa reload halaman
import Link from "next/link";
// Import Image dari Next.js untuk optimasi gambar otomatis
import Image from "next/image";
// Import hooks React untuk state management dan side effects
import { useState, useEffect } from "react";

// Interface untuk tipe data Cake (Kue)
// Mendefinisikan struktur data kue yang akan ditampilkan di katalog
interface Cake {
  id: string;           // ID unik kue
  name: string;         // Nama kue
  price: number;        // Harga kue
  imageUrl: string;     // URL gambar kue
  isAvailable: boolean; // Status ketersediaan kue
}

// Komponen utama untuk halaman beranda (homepage)
// Menampilkan katalog kue, navigasi, dan informasi toko
export default function HomePage() {
  // State untuk menyimpan daftar kue yang tersedia
  const [cakes, setCakes] = useState<Cake[]>([]);
  // State untuk tracking loading state saat fetch data
  const [isLoading, setIsLoading] = useState(true);
  // State untuk kategori yang dipilih (filter kue)
  const [selectedCategory, setSelectedCategory] = useState("semua");
  // State untuk toggle menu mobile (hamburger menu)
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // useEffect dijalankan sekali saat komponen pertama kali dimuat
  // Memanggil fungsi fetchCakes untuk mengambil data dari API
  useEffect(() => {
    fetchCakes();
  }, []); // Dependency array kosong = hanya run sekali saat mount

  // Fungsi untuk mengambil data kue yang tersedia dari API
  const fetchCakes = async () => {
    try {
      // Fetch data dari API endpoint /api/cakes/available
      const res = await fetch("/api/cakes/available");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(`Fetch error: ${res.status} ${res.statusText} - ${JSON.stringify(data)}`);
      }

      // Simpan data kue ke state, pastikan selalu array
      setCakes(Array.isArray(data) ? data : []);
    } catch (error) {
      // Log error jika fetch gagal
      console.error("Error fetching cakes:", error);
      setCakes([]);
    } finally {
      // Set loading menjadi false setelah fetch selesai (sukses atau error)
      setIsLoading(false);
    }
  };

  // Daftar kategori untuk filter kue
  // Saat ini hanya ada 1 kategori (semua), bisa diperluas di masa depan
  const categories = [
    { id: "semua", name: "Semua Kue", icon: "🧁" },
  ];

  // Return JSX - Tampilan UI halaman homepage
  return (
    // Container utama dengan min height full screen
    <div className="min-h-screen bg-white">
      {/* Navigation Bar - Header yang sticky di atas */}
      <nav className="border-b border-neutral-200 bg-white">
        {/* Container dengan max width dan padding */}
        <div className="container mx-auto px-4 py-4">
          {/* Flex container untuk logo dan menu */}
          <div className="flex justify-between items-center">
            {/* Logo dan nama toko */}
            <Link href="/" className="flex items-center gap-3">
              {/* Icon emoji kue */}
              <span className="text-2xl">🧁</span>
              {/* Nama dan subtitle toko */}
              <div>
                <h1 className="text-xl font-bold text-neutral-900">
                  Toko Kue UMKM
                </h1>
                <p className="text-xs text-neutral-500">Kue Tradisional</p>
              </div>
            </Link>
            
            {/* Desktop Navigation - Tampil di layar >=md */}
            <div className="hidden md:flex items-center gap-8">
              {/* Link anchor ke section About */}
              <a href="#tentang" className="text-neutral-700 hover:text-neutral-900 transition text-sm">
                Tentang
              </a>
              {/* Link anchor ke section Menu */}
              <a href="#menu" className="text-neutral-700 hover:text-neutral-900 transition text-sm">
                Menu
              </a>
              {/* Link anchor ke section Kontak */}
              <a href="#kontak" className="text-neutral-700 hover:text-neutral-900 transition text-sm">
                Kontak
              </a>
              {/* Tombol login untuk penjual */}
              <Link
                href="/login"
                className="btn-primary text-sm"
              >
                Login Penjual
              </Link>
            </div>

            {/* Mobile Menu Button - Hamburger menu untuk mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)} // Toggle menu mobile
              className="md:hidden p-2"
            >
              {/* Icon SVG yang berubah antara X dan hamburger */}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  // Icon X ketika menu terbuka
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  // Icon hamburger ketika menu tertutup
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu - Tampil ketika isMenuOpen true */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-neutral-200">
              {/* Menu mobile dalam layout vertikal */}
              <div className="flex flex-col gap-3">
                <a href="#tentang" className="text-neutral-700 hover:text-neutral-900 py-2 text-sm">
                  Tentang
                </a>
                <a href="#menu" className="text-neutral-700 hover:text-neutral-900 py-2 text-sm">
                  Menu
                </a>
                <a href="#kontak" className="text-neutral-700 hover:text-neutral-900 py-2 text-sm">
                  Kontak
                </a>
                <Link
                  href="/login"
                  className="btn-primary text-sm text-center"
                >
                  Login Penjual
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section - Bagian utama dengan CTA dan statistik */}
      <section className="bg-accent-cream">
        {/* Container dengan padding vertikal yang besar */}
        <div className="container mx-auto px-4 py-16 md:py-24">
          {/* Grid dua kolom: konten kiri, visual kanan */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Kolom kiri: Konten hero */}
            <div>
              {/* Badge kecil di atas judul */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-neutral-200 rounded-natural mb-4">
                <span className="text-sm">✨</span>
                <span className="text-sm text-neutral-700">Kue Homemade Terbaik</span>
              </div>
              {/* Judul hero yang besar dan menarik perhatian */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-neutral-900 mb-5 leading-tight">
                Kue Lezat untuk Momen Spesial
              </h1>
              {/* Deskripsi singkat value proposition */}
              <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                Nikmati kelezatan kue tradisional yang dibuat dengan resep turun temurun dan bahan pilihan berkualitas tinggi
              </p>
              {/* Call-to-action buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Primary CTA - Pesan Sekarang */}
                <a
                  href="#menu"
                  className="btn-primary"
                >
                  Pesan Sekarang
                </a>
                {/* Secondary CTA - Lihat Menu */}
                <a
                  href="#menu"
                  className="btn-outline"
                >
                  Lihat Menu
                </a>
              </div>
              {/* Section statistik untuk membangun kredibilitas */}
              <div className="mt-12 flex gap-8">
                {/* Jumlah pelanggan */}
                <div>
                  <div className="text-3xl font-bold text-primary-600">100+</div>
                  <div className="text-sm text-neutral-600 mt-1">Pelanggan</div>
                </div>
                {/* Jumlah varian kue */}
                <div>
                  <div className="text-3xl font-bold text-primary-600">50+</div>
                  <div className="text-sm text-neutral-600 mt-1">Varian Kue</div>
                </div>
                {/* Rating */}
                <div>
                  <div className="text-3xl font-bold text-primary-600">5★</div>
                  <div className="text-sm text-neutral-600 mt-1">Rating</div>
                </div>
              </div>
            </div>
            {/* Kolom kanan: Visual cards (hidden di mobile) */}
            <div className="hidden md:block">
              {/* Grid cards menampilkan kategori kue */}
              <div className="grid grid-cols-2 gap-4">
                {/* Card Kue Manis */}
                <div className="card-natural p-5">
                  <div className="text-5xl mb-2">🍰</div>
                  <div className="font-semibold text-neutral-800">Kue Manis</div>
                </div>
                {/* Card Kue Gurih dengan margin top untuk stagger effect */}
                <div className="card-natural p-5 mt-6">
                  <div className="text-5xl mb-2">🥖</div>
                  <div className="font-semibold text-neutral-800">Kue Gurih</div>
                </div>
                {/* Card Kue Tradisional span 2 kolom */}
                <div className="card-natural p-5 col-span-2">
                  <div className="text-5xl mb-2">🧁</div>
                  <div className="font-semibold text-neutral-800">Kue Tradisional</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Menjelaskan tentang toko dan nilai-nilai */}
      <section id="tentang" className="py-16 md:py-20 px-4 bg-white">
        {/* Container dengan max width */}
        <div className="container mx-auto max-w-6xl">
          {/* Grid dua kolom: konten kiri, visual cards kanan */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Kolom kiri: Konten About */}
            <div>
              {/* Label section */}
              <span className="text-primary-500 font-semibold text-sm uppercase">Tentang Kami</span>
              {/* Judul section */}
              <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mt-3 mb-5">
                Kelezatan di Setiap Gigitan
              </h2>
              {/* Paragraf pertama: Pengenalan */}
              <p className="text-neutral-600 text-base leading-relaxed mb-4">
                Kami adalah UMKM lokal yang berdedikasi untuk menghadirkan kue-kue berkualitas dengan cita rasa otentik. Setiap produk dibuat dengan penuh kasih sayang menggunakan resep tradisional yang telah teruji.
              </p>
              {/* Paragraf kedua: Komitmen kualitas */}
              <p className="text-neutral-600 text-base leading-relaxed mb-6">
                Dengan bahan pilihan terbaik dan proses pembuatan yang higienis, kami memastikan setiap kue yang sampai ke tangan Anda adalah yang terbaik.
              </p>
              {/* List keunggulan dengan icon checkmark */}
              <div className="flex flex-wrap gap-4 mb-6">
                {/* Keunggulan 1: Bahan Alami */}
                <div className="flex items-center gap-2 text-primary-600">
                  <span className="text-xl">✓</span>
                  <span className="font-medium text-sm">Bahan Alami</span>
                </div>
                {/* Keunggulan 2: Tanpa Pengawet */}
                <div className="flex items-center gap-2 text-primary-600">
                  <span className="text-xl">✓</span>
                  <span className="font-medium text-sm">Tanpa Pengawet</span>
                </div>
                {/* Keunggulan 3: Halal & Higienis */}
                <div className="flex items-center gap-2 text-primary-600">
                  <span className="text-xl">✓</span>
                  <span className="font-medium text-sm">Halal & Higienis</span>
                </div>
              </div>
            </div>
            {/* Kolom kanan: Grid cards dengan icon */}
            <div>
              {/* Grid 2x2 cards */}
              <div className="grid grid-cols-2 gap-3">
                {/* Card 1: Kualitas Terjamin */}
                <div className="card-natural p-6 text-center">
                  <div className="text-4xl mb-2">🏆</div>
                  <div className="font-semibold text-neutral-800 text-sm">Kualitas Terjamin</div>
                </div>
                {/* Card 2: Chef Berpengalaman (dengan margin top untuk stagger) */}
                <div className="card-natural p-6 text-center mt-6">
                  <div className="text-4xl mb-2">👨‍🍳</div>
                  <div className="font-semibold text-neutral-800 text-sm">Chef Berpengalaman</div>
                </div>
                {/* Card 3: Bahan Premium */}
                <div className="card-natural p-6 text-center">
                  <div className="text-4xl mb-2">🥇</div>
                  <div className="font-semibold text-neutral-800 text-sm">Bahan Premium</div>
                </div>
                {/* Card 4: Halal & Higienis (dengan margin top untuk stagger) */}
                <div className="card-natural p-6 text-center mt-6">
                  <div className="text-4xl mb-2">💯</div>
                  <div className="font-semibold text-neutral-800 text-sm">Halal & Higienis</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section - Katalog kue yang tersedia */}
      <section id="menu" className="py-16 md:py-20 px-4 bg-neutral-50">
        {/* Container dengan max width */}
        <div className="container mx-auto max-w-7xl">
          {/* Header section */}
          <div className="mb-10">
            {/* Label section */}
            <span className="text-primary-500 font-semibold text-sm uppercase">Menu Spesial Kami</span>
            {/* Judul section */}
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mt-3 mb-4">
              Pilihan Kue Terlezat
            </h2>
            {/* Deskripsi section */}
            <p className="text-neutral-600 text-base max-w-2xl">
              Jelajahi koleksi kue homemade kami yang dibuat fresh setiap hari dengan resep rahasia warisan keluarga
            </p>
          </div>

          {/* Category Filter - Tombol filter kategori */}
          <div className="flex flex-wrap gap-3 mb-10">
            {/* Loop semua kategori */}
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)} // Set kategori yang dipilih
                // Styling conditional: berbeda jika terpilih
                className={`px-4 py-2 rounded-natural font-medium transition text-sm ${
                  selectedCategory === category.id
                    ? "bg-primary-500 text-white" // Style saat terpilih
                    : "bg-white text-neutral-700 border border-neutral-200 hover:border-primary-500" // Style default
                }`}
              >
                {/* Icon kategori */}
                <span className="mr-2">{category.icon}</span>
                {/* Nama kategori */}
                {category.name}
              </button>
            ))}
          </div>

          {/* Conditional rendering berdasarkan state */}
          {isLoading ? (
            // Loading state - Tampilkan spinner
            <div className="text-center py-20">
              {/* Spinner animation */}
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500"></div>
              <p className="mt-4 text-neutral-600">Memuat menu...</p>
            </div>
          ) : cakes.length === 0 ? (
            // Empty state - Tidak ada kue tersedia
            <div className="text-center py-20 card-natural">
              <div className="text-6xl mb-4">🍰</div>
              <h3 className="text-xl font-bold text-neutral-800 mb-2">Menu Segera Hadir!</h3>
              <p className="text-neutral-600">Kami sedang menyiapkan kue-kue spesial untuk Anda</p>
            </div>
          ) : (
            // Data state - Tampilkan grid kue
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {/* Loop semua kue */}
              {cakes.map((cake) => (
                // Card kue dengan hover effect
                <div
                  key={cake.id}
                  className="group card-natural overflow-hidden hover:shadow-md transition"
                >
                  {/* Gambar kue dengan badge status */}
                  <div className="relative h-48 overflow-hidden bg-neutral-100">
                    {/* Image dengan hover zoom effect */}
                    <Image
                      src={cake.imageUrl}
                      alt={cake.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Badge "Ready" di pojok kanan atas */}
                    <div className="absolute top-3 right-3">
                      <span className="bg-green-500 text-white px-2 py-0.5 rounded-natural text-xs font-medium">
                        Ready
                      </span>
                    </div>
                  </div>
                  {/* Konten card: nama, harga, rating, tombol */}
                  <div className="p-4">
                    {/* Nama kue dengan truncate */}
                    <h3 className="font-display font-semibold text-base mb-2 text-neutral-800 truncate">
                      {cake.name}
                    </h3>
                    {/* Harga dan rating */}
                    <div className="flex items-center justify-between mb-3">
                      {/* Harga */}
                      <div>
                        <div className="text-xs text-neutral-500 mb-0.5">Harga</div>
                        {/* Format harga dengan locale Indonesia */}
                        <p className="text-primary-600 font-bold text-lg">
                          Rp {cake.price.toLocaleString("id-ID")}
                        </p>
                      </div>
                      {/* Rating bintang 5 */}
                      <div className="flex text-yellow-500 text-xs">
                        {"★".repeat(5)}
                      </div>
                    </div>
                    {/* Tombol Pesan dengan link ke halaman order */}
                    <Link
                      href={`/order?cakeId=${cake.id}`} // Pass cakeId sebagai query param
                      className="block w-full text-center btn-primary text-sm"
                    >
                      Pesan Sekarang
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section - Alasan memilih toko ini */}
      <section className="py-16 md:py-20 px-4 bg-white">
        {/* Container dengan max width */}
        <div className="container mx-auto max-w-6xl">
          {/* Header section */}
          <div className="text-center mb-12">
            {/* Judul */}
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-3">
              Kenapa Memilih Kami?
            </h2>
            {/* Subtitle */}
            <p className="text-neutral-600">Kami berkomitmen memberikan yang terbaik untuk Anda</p>
          </div>
          {/* Grid 3 kolom untuk keunggulan */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Keunggulan 1: Selalu Fresh */}
            <div className="text-center p-6 card-natural">
              {/* Icon dengan background warna */}
              <div className="w-16 h-16 bg-accent-cream rounded-natural flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🎂</span>
              </div>
              {/* Judul keunggulan */}
              <h3 className="font-display font-bold text-lg mb-2 text-neutral-800">Selalu Fresh</h3>
              {/* Deskripsi keunggulan */}
              <p className="text-neutral-600 text-sm">
                Setiap kue dibuat fresh setiap hari dengan bahan pilihan berkualitas premium untuk kesegaran maksimal
              </p>
            </div>
            {/* Keunggulan 2: Dibuat dengan Cinta */}
            <div className="text-center p-6 card-natural">
              {/* Icon dengan background warna berbeda */}
              <div className="w-16 h-16 bg-accent-rose rounded-natural flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">💝</span>
              </div>
              {/* Judul keunggulan */}
              <h3 className="font-display font-bold text-lg mb-2 text-neutral-800">Dibuat dengan Cinta</h3>
              {/* Deskripsi keunggulan */}
              <p className="text-neutral-600 text-sm">
                Setiap produk dibuat dengan penuh perhatian dan kasih sayang, seperti kue buatan rumah sendiri
              </p>
            </div>
            {/* Keunggulan 3: Proses Cepat */}
            <div className="text-center p-6 card-natural">
              {/* Icon dengan background warna berbeda */}
              <div className="w-16 h-16 bg-accent-tan rounded-natural flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🚀</span>
              </div>
              {/* Judul keunggulan */}
              <h3 className="font-display font-bold text-lg mb-2 text-neutral-800">Proses Cepat</h3>
              {/* Deskripsi keunggulan */}
              <p className="text-neutral-600 text-sm">
                Sistem pemesanan online yang mudah dan cepat, langsung dari smartphone Anda kapan saja
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Call-to-Action untuk mendorong konversi */}
      <section className="py-16 md:py-20 px-4 bg-primary-500">
        {/* Container dengan max width dan centered */}
        <div className="container mx-auto max-w-4xl text-center">
          {/* Judul CTA yang menarik perhatian */}
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Siap Memesan Kue Lezat?
          </h2>
          {/* Deskripsi pendukung */}
          <p className="text-base md:text-lg text-white/90 mb-6">
            Jangan tunggu lagi! Pesan sekarang dan nikmati kelezatan kue homemade kami
          </p>
          {/* Tombol CTA utama */}
          <a
            href="#menu"
            className="inline-block bg-white text-primary-600 font-semibold py-3 px-8 rounded-natural transition hover:bg-neutral-50"
          >
            Mulai Pesan Sekarang
          </a>
        </div>
      </section>

      {/* Footer - Bagian bawah halaman dengan informasi kontak */}
      <footer id="kontak" className="bg-neutral-900 text-white py-10 px-4">
        {/* Container dengan max width */}
        <div className="container mx-auto max-w-6xl">
          {/* Grid 3 kolom untuk informasi footer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Kolom 1: Info Toko */}
            <div>
              {/* Logo dan nama toko */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-3xl">🧁</span>
                <h3 className="text-xl font-display font-bold">Toko Kue UMKM</h3>
              </div>
              {/* Deskripsi singkat */}
              <p className="text-neutral-400 text-sm">
                Menghadirkan kue tradisional berkualitas untuk setiap momen spesial Anda
              </p>
            </div>
            {/* Kolom 2: Menu Links */}
            <div>
              <h4 className="font-bold text-base mb-3">Menu</h4>
              <ul className="space-y-2 text-neutral-400 text-sm">
                {/* Link ke section Tentang */}
                <li><a href="#tentang" className="hover:text-white transition">Tentang Kami</a></li>
                {/* Link ke section Menu */}
                <li><a href="#menu" className="hover:text-white transition">Menu Kue</a></li>
                {/* Link ke halaman Order */}
                <li><Link href="/order" className="hover:text-white transition">Cara Pesan</Link></li>
              </ul>
            </div>
            {/* Kolom 3: Informasi Kontak */}
            <div>
              <h4 className="font-bold text-base mb-3">Kontak</h4>
              <ul className="space-y-2 text-neutral-400 text-sm">
                {/* Nomor WhatsApp */}
                <li>WhatsApp: 0812-3456-7890</li>
                {/* Email */}
                <li>Email: info@tokokueumkm.com</li>
                {/* Alamat fisik */}
                <li>Alamat: Samata, Gowa</li>
              </ul>
            </div>
          </div>
          {/* Copyright dan link tambahan */}
          <div className="border-t border-neutral-800 pt-6 text-center">
            {/* Copyright notice */}
            <p className="text-neutral-400 text-sm">
              © 2026 Toko Kue UMKM. Semua hak dilindungi.
            </p>
            {/* Link ke Portal Penjual */}
            <div className="mt-3">
              <Link href="/login" className="text-primary-400 hover:text-primary-300 transition text-xs">
                Portal Penjual
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
