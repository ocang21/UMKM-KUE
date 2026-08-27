// Import tipe Metadata dari Next.js untuk SEO configuration
import type { Metadata } from "next";
// Import font Inter dan Playfair Display dari Google Fonts
import { Inter, Playfair_Display } from "next/font/google";
// Import global CSS styles
import "./globals.css";
// Import Toaster untuk menampilkan notifikasi toast
import { Toaster } from "react-hot-toast";
// Import SessionProvider untuk mengelola autentikasi session
import SessionProvider from "@/components/SessionProvider";

// Konfigurasi font Inter sebagai font utama untuk body text
const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

// Konfigurasi font Playfair Display untuk heading editorial bakery yang elegan
const playfair = Playfair_Display({ 
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ["latin"],
  variable: '--font-playfair',
  display: 'swap',
});

// Metadata untuk SEO (Search Engine Optimization)
export const metadata: Metadata = {
  title: "Toko Kue UMKM | Artisan Bakery & Traditional Cakes",
  description: "Kue homemade tradisional dan modern berkualitas artisan dengan bahan pilihan terbaik.",
  icons: {
    icon: "/logo.jpeg",
    shortcut: "/logo.jpeg",
    apple: "/logo.jpeg",
  },
};

// Viewport configuration untuk responsive design
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#56351F', // Warna coklat artisan
};

// Root Layout Component - Layout utama yang membungkus seluruh aplikasi
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-cream-50 text-neutral-800 antialiased selection:bg-accent-gold selection:text-white`}>
        <SessionProvider>
          {children}
          <Toaster 
            position="top-center" 
            toastOptions={{
              style: {
                background: '#3D2516',
                color: '#FAF5EC',
                borderRadius: '8px',
                border: '1px solid #C89F6E',
                fontSize: '14px',
              },
              success: {
                iconTheme: {
                  primary: '#C89F6E',
                  secondary: '#3D2516',
                },
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
