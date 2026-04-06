// File backup: Homepage versi lama sebelum redesign
// Directive untuk menandai ini sebagai Client Component
'use client';

// Import komponen Next.js
import Link from "next/link";
import Image from "next/image";
// Import hooks React
import { useState, useEffect } from "react";

// Interface untuk tipe data Cake
interface Cake {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
}

export default function HomePage() {
  // State untuk menyimpan daftar kue yang tersedia
  const [cakes, setCakes] = useState<Cake[]>([]);
  // State untuk status loading
  const [isLoading, setIsLoading] = useState(true);

  // Effect untuk fetch kue saat komponen dimount
  useEffect(() => {
    fetchCakes();
  }, []);

  // Fungsi untuk fetch kue yang ready/tersedia
  const fetchCakes = async () => {
    try {
      // Panggil API public untuk kue yang available
      const res = await fetch("/api/cakes/available");
      const data = await res.json();
      setCakes(data);
    } catch (error) {
      console.error("Error fetching cakes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - Banner utama dengan CTA */}
      <section className="bg-gradient-to-br from-bakery-cream via-bakery-peach to-bakery-pink py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          {/* Icon kue dengan animasi bounce */}
          <div className="text-7xl mb-6 animate-bounce">🧁</div>
          <h1 className="text-5xl md:text-6xl font-display font-bold text-primary-700 mb-6">
            Toko Kue UMKM
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Kue homemade segar & lezat dibuat dengan cinta untuk kebahagiaan Anda
          </p>
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#menu"
              className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 px-8 rounded-full transition shadow-lg hover:shadow-xl text-lg"
            >
              Lihat Menu Kue
            </a>
            <Link
              href="/login"
              className="bg-white hover:bg-gray-50 text-primary-600 font-bold py-4 px-8 rounded-full transition shadow-lg hover:shadow-xl text-lg border-2 border-primary-500"
            >
              Login Penjual
            </Link>
          </div>
        </div>
      </section>

      {/* Menu Section - Daftar kue yang tersedia */}
      <section id="menu" className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          {/* Header section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold text-gray-800 mb-4">
              Menu Kue Kami
            </h2>
            <p className="text-gray-600 text-lg">
              Pilih kue favorit Anda dan pesan sekarang!
            </p>
          </div>

          {/* Loading state */}
          {isLoading ? (
            <div className="text-center py-12">
              {/* Spinner loading */}
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : cakes.length === 0 ? (
            // Empty state jika belum ada kue
            <div className="text-center py-12 bg-bakery-cream rounded-xl">
              <div className="text-6xl mb-4">🍰</div>
              <p className="text-gray-600 text-lg">Belum ada menu kue tersedia saat ini</p>
            </div>
          ) : (
            // Grid layout untuk kue (responsive 1-4 kolom)
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cakes.map((cake) => (
                // Card untuk setiap kue dengan hover effect
                <div
                  key={cake.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  {/* Gambar kue */}
                  <div className="relative h-56">
                    <Image
                      src={cake.imageUrl}
                      alt={cake.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {/* Info kue: nama, harga, tombol pesan */}
                  <div className="p-5">
                    <h3 className="font-display font-bold text-xl mb-2 text-gray-800">
                      {cake.name}
                    </h3>
                    <p className="text-primary-600 font-bold text-2xl mb-4">
                      Rp {cake.price.toLocaleString("id-ID")}
                    </p>
                    {/* Link ke halaman order dengan pre-filled cakeId */}
                    <Link
                      href={`/order?cakeId=${cake.id}`}
                      className="block w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-4 rounded-lg transition text-center shadow-md hover:shadow-lg"
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

      {/* Features Section - Highlight keunggulan toko */}
      <section className="py-16 px-4 bg-gradient-to-br from-bakery-mint via-bakery-cream to-bakery-lavender">
        <div className="container mx-auto max-w-6xl">
          {/* Grid 3 kolom untuk fitur */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1: Kue Fresh */}
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="text-5xl mb-4">🎂</div>
              <h3 className="font-display font-bold text-xl mb-3 text-gray-800">Kue Fresh</h3>
              <p className="text-gray-600">
                Dibuat fresh setiap hari dengan bahan berkualitas
              </p>
            </div>
            {/* Feature 2: Dibuat dengan Cinta */}
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="text-5xl mb-4">💝</div>
              <h3 className="font-display font-bold text-xl mb-3 text-gray-800">Dibuat dengan Cinta</h3>
              <p className="text-gray-600">
                Setiap kue dibuat dengan penuh perhatian dan kasih sayang
              </p>
            </div>
            {/* Feature 3: Pesan Mudah */}
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="font-display font-bold text-xl mb-3 text-gray-800">Pesan Mudah</h3>
              <p className="text-gray-600">
                Proses pemesanan yang cepat dan mudah
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Informasi toko dan link */}
      <footer className="bg-primary-800 text-white py-8 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-lg mb-2">🧁 Toko Kue UMKM</p>
          <p className="text-primary-200">
            Kue lezat untuk setiap momen spesial Anda
          </p>
          {/* Link ke halaman login seller */}
          <div className="mt-6">
            <Link href="/login" className="text-primary-200 hover:text-white transition">
              Login Penjual
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
