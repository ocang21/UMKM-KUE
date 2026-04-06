// Import tipe Metadata dari Next.js untuk SEO configuration
import type { Metadata } from "next";
// Import font Inter dan Poppins dari Google Fonts
import { Inter, Poppins } from "next/font/google";
// Import global CSS styles
import "./globals.css";
// Import Toaster untuk menampilkan notifikasi toast
import { Toaster } from "react-hot-toast";
// Import SessionProvider untuk mengelola autentikasi session
import SessionProvider from "@/components/SessionProvider";

// Konfigurasi font Inter sebagai font utama
// Font ini akan digunakan untuk body text
const inter = Inter({ 
  subsets: ["latin"],              // Subset karakter Latin
  variable: '--font-inter',        // CSS variable untuk font
  display: 'swap',                 // Font display strategy untuk performa
});

// Konfigurasi font Poppins untuk heading dan display text
// Font ini lebih dekoratif dan cocok untuk judul
const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'], // Weight yang tersedia
  subsets: ["latin"],                   // Subset karakter Latin
  variable: '--font-poppins',           // CSS variable untuk font
  display: 'swap',                      // Font display strategy untuk performa
});

// Metadata untuk SEO (Search Engine Optimization)
// Informasi ini akan muncul di hasil pencarian Google dan tab browser
export const metadata: Metadata = {
  title: "Toko Kue UMKM",                                      // Judul website
  description: "Toko kue online dengan berbagai pilihan kue lezat", // Deskripsi website
};

// Viewport configuration untuk responsive design
// Mengatur bagaimana halaman ditampilkan di berbagai device
export const viewport = {
  width: 'device-width',   // Lebar mengikuti lebar device
  initialScale: 1,         // Zoom awal 1:1
  maximumScale: 5,         // Maksimal zoom 5x
  themeColor: '#FF6B6B',   // Warna tema browser (tampil di status bar mobile)
};

// Root Layout Component - Layout utama yang membungkus seluruh aplikasi
// Setiap halaman akan di-render di dalam layout ini
export default function RootLayout({
  children, // Konten halaman yang akan di-render
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // HTML root element dengan bahasa Indonesia
    <html lang="id">
      {/* Body dengan font variables yang sudah dikonfigurasi */}
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        {/* SessionProvider membungkus seluruh app untuk mengelola autentikasi */}
        <SessionProvider>
          {/* Konten halaman akan di-render di sini */}
          {children}
          {/* Toaster untuk menampilkan notifikasi (sukses, error, info) */}
          <Toaster position="top-center" />
        </SessionProvider>
      </body>
    </html>
  );
}
