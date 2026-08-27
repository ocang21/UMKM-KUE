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
    { href: "/dashboard/content", label: "Kelola Konten" }, // Halaman edit teks & konten website
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
    <nav className="bg-white border-b border-cream-300 sticky top-0 z-30 shadow-warm-sm">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand - Link ke dashboard home */}
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-accent-gold flex-shrink-0 bg-cream-100">
              <img
                src="/logo.jpeg"
                alt="Logo Toko Kue UMKM"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-base font-display font-bold text-primary-900 leading-none block">
                Dashboard Penjual
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-accent-amber">
                Toko Kue UMKM
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-full font-medium transition text-xs tracking-wide uppercase ${
                  pathname === item.href
                    ? "bg-primary-800 text-cream-50 shadow-warm-sm"
                    : "text-neutral-700 hover:bg-cream-100 hover:text-primary-800"
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Tombol Logout */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="ml-3 px-4 py-1.5 border border-red-200 text-red-700 rounded-full font-medium hover:bg-red-50 transition disabled:opacity-50 flex items-center gap-1.5 text-xs uppercase tracking-wide"
            >
              {isLoggingOut && (
                <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isLoggingOut ? "Keluar..." : "Logout"}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-primary-900 rounded-lg"
            aria-label="Menu"
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

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-3 border-t border-cream-200 space-y-1.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg font-medium transition text-xs uppercase tracking-wider ${
                  pathname === item.href
                    ? "bg-primary-800 text-cream-50"
                    : "text-neutral-700 hover:bg-cream-100"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full mt-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50 text-xs uppercase tracking-wider text-center"
            >
              {isLoggingOut ? "Keluar..." : "Logout"}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
