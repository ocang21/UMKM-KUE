// Directive untuk menandakan komponen ini adalah Client Component
// Diperlukan karena menggunakan hooks dan interaksi client-side
'use client';

// Import Link dari Next.js untuk navigasi client-side
import Link from "next/link";
// Import usePathname untuk mendapatkan path URL saat ini (untuk highlighting menu aktif)
import { usePathname } from "next/navigation";
// Import signOut dari NextAuth untuk logout functionality
import { signOut } from "next-auth/react";
// Import useState untuk state management
import { useState } from "react";

// Komponen DashboardNav - Navigation bar  untuk dashboard penjual
// Menampilkan menu navigasi dan tombol logout
export default function DashboardNav() {
  // Hook untuk mendapatkan pathname saat ini (untuk meng-highlight menu yang aktif)
  const pathname = usePathname();
  // State untuk toggle mobile menu (hamburger menu)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // State untuk tracking loading state saat logout
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Array menu items dashboard
  // Berisi semua halaman yang bisa diakses di dashboard
  const navItems = [
    { href: "/dashboard", label: "Dashboard" },        // Halaman utama dashboard
    { href: "/dashboard/cakes", label: "Menu Kue" },   // Halaman manajemen kue
    { href: "/dashboard/payment", label: "Rekening" }, // Halaman manajemen rekening
    { href: "/dashboard/orders", label: "Pesanan" },   // Halaman daftar pesanan
  ];

  // Fungsi untuk handle logout
  const handleLogout = async () => {
    // Set loading state menjadi true untuk disable button
    setIsLoggingOut(true);
    // Panggil signOut dari NextAuth untuk clear session
    await signOut();
    // Redirect manual ke halaman login (hard redirect untuk clear state)
    window.location.href = "/login";
  };

  // Return JSX - Tampilan navigation bar
  return (
    // Navigation container dengan border bawah
    <nav className="bg-white border-b border-neutral-200">
      {/* Container dengan max width dan padding */}
      <div className="container mx-auto px-4">
        {/* Flex container untuk logo dan menu */}
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand - Link ke dashboard home */}
          <Link href="/dashboard" className="text-lg font-display font-bold text-neutral-900">
            🧁 Dashboard Penjual
          </Link>

          {/* Desktop Navigation - Tampil di layar >=md */}
          <div className="hidden md:flex items-center gap-2">
            {/* Loop semua nav items */}
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                // Styling conditional: berbeda jika menu aktif (pathname match)
                className={`px-4 py-2 rounded-natural font-medium transition text-sm ${
                  pathname === item.href
                    ? "bg-primary-500 text-white"          // Style saat aktif
                    : "text-neutral-700 hover:bg-neutral-100" // Style default
                }`}
              >
                {item.label}
              </Link>
            ))}
            {/* Tombol Logout */}
            <button
              onClick={handleLogout} // Handler logout
              disabled={isLoggingOut} // Disable saat loading
              className="ml-4 px-4 py-2 bg-red-500 text-white rounded-natural font-medium hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
            >
              {/* Tampilkan spinner hanya saat loading */}
              {isLoggingOut && (
                // SVG spinner dengan animasi rotate
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {/* Text berubah saat loading */}
              {isLoggingOut ? "Keluar..." : "Logout"}
            </button>
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

        {/* Mobile Navigation - Tampil ketika isMenuOpen true */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-200 space-y-2">
            {/* Loop semua nav items */}
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)} // Tutup menu saat item diklik
                // Styling conditional: berbeda jika menu aktif
                className={`block px-4 py-2 rounded-natural font-medium transition text-sm ${
                  pathname === item.href
                    ? "bg-primary-500 text-white"          // Style saat aktif
                    : "text-neutral-700 hover:bg-neutral-100" // Style default
                }`}
              >
                {item.label}
              </Link>
            ))}
            {/* Tombol Logout untuk mobile */}
            <button
              onClick={handleLogout} // Handler logout
              disabled={isLoggingOut} // Disable saat loading
              className="w-full mt-2 px-4 py-2 bg-red-500 text-white rounded-natural font-medium hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {/* Tampilkan spinner hanya saat loading */}
              {isLoggingOut && (
                // SVG spinner dengan animasi rotate
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {/* Text berubah saat loading */}
              {isLoggingOut ? "Keluar..." : "Logout"}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
