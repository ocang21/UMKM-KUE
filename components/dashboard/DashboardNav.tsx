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

// Komponen DashboardNav - Navigation bar untuk dashboard penjual
// Dilengkapi dengan Desktop Header Nav dan Mobile Bottom Navigation Bar yang ramah jempol
export default function DashboardNav() {
  // Hook untuk mendapatkan pathname saat ini (untuk meng-highlight menu yang aktif)
  const pathname = usePathname();
  // State untuk toggle profile/logout popup di mobile
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  // State untuk tracking loading state saat logout
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Array menu items dashboard
  const navItems = [
    {
      href: "/dashboard",
      label: "Ringkasan",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      )
    },
    {
      href: "/dashboard/cakes",
      label: "Menu Kue",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      href: "/dashboard/orders",
      label: "Pesanan",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    {
      href: "/dashboard/payment",
      label: "Rekening",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    },
    {
      href: "/dashboard/content",
      label: "Konten",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
  ];

  // Fungsi untuk handle logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut();
    window.location.href = "/login";
  };

  return (
    <>
      {/* Top Header Navbar */}
      <nav className="bg-white border-b border-cream-300 sticky top-0 z-30 shadow-warm-sm">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Info Toko */}
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-accent-gold flex-shrink-0 bg-cream-100 shadow-sm">
                <img
                  src="/logo.jpeg"
                  alt="Logo Toko Kue UMKM"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-sm sm:text-base font-display font-bold text-primary-900 leading-none block">
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
                  className={`px-3.5 py-2 rounded-full font-medium transition text-xs tracking-wide uppercase ${
                    pathname === item.href
                      ? "bg-primary-800 text-cream-50 shadow-warm-sm"
                      : "text-neutral-700 hover:bg-cream-100 hover:text-primary-800"
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              <div className="h-5 w-px bg-cream-300 mx-1"></div>

              {/* Link Lihat Toko Publik */}
              <Link
                href="/"
                target="_blank"
                className="px-3 py-1.5 text-xs font-semibold text-primary-800 hover:text-primary-900 rounded-full hover:bg-cream-100 transition inline-flex items-center gap-1 uppercase tracking-wider"
              >
                <span>Lihat Website</span>
                <span>↗</span>
              </Link>

              {/* Tombol Logout */}
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="ml-2 px-3.5 py-1.5 border border-red-200 text-red-700 rounded-full font-medium hover:bg-red-50 transition disabled:opacity-50 flex items-center gap-1.5 text-xs uppercase tracking-wide"
              >
                {isLoggingOut && (
                  <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                <span>{isLoggingOut ? "Keluar..." : "Logout"}</span>
              </button>
            </div>

            {/* Mobile Header Actions (Lihat Web & Menu Akun) */}
            <div className="flex items-center gap-2 md:hidden">
              <Link
                href="/"
                target="_blank"
                className="px-2.5 py-1 text-[11px] font-semibold text-primary-800 bg-cream-100 hover:bg-cream-200 rounded-full border border-cream-300 transition"
              >
                Web ↗
              </Link>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="p-2 text-primary-900 rounded-lg hover:bg-cream-100 transition"
                aria-label="Profile Menu"
              >
                <div className="w-7 h-7 rounded-full bg-primary-800 text-cream-50 flex items-center justify-center text-xs font-bold font-display">
                  A
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Profile Dropdown Popup */}
        {isProfileOpen && (
          <div className="md:hidden border-t border-cream-200 bg-white px-4 py-3 shadow-lg animate-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-cream-200">
              <div>
                <p className="text-xs font-bold text-primary-900">Admin Toko Kue</p>
                <p className="text-[11px] text-neutral-500">kuetradisional@penjual</p>
              </div>
              <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                Online
              </span>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full py-2.5 px-4 bg-red-600 active:bg-red-700 text-white rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
            >
              {isLoggingOut ? "Sedang Keluar..." : "Keluar / Logout"}
            </button>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Navigation Bar (Thumb-Zone Friendly) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-cream-300 md:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-5 h-16 items-center px-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center h-full py-1 transition-colors relative ${
                  isActive ? "text-primary-900 font-bold" : "text-neutral-500 hover:text-primary-800"
                }`}
              >
                {isActive && (
                  <span className="absolute top-1.5 w-6 h-1 bg-accent-gold rounded-full"></span>
                )}
                <div className={`p-1 rounded-lg transition-transform ${isActive ? "scale-110 text-primary-800" : ""}`}>
                  {item.icon}
                </div>
                <span className={`text-[10px] tracking-tight truncate max-w-full px-1 ${isActive ? "font-bold text-primary-900" : "font-medium text-neutral-600"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
