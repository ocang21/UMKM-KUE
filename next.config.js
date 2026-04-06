/** @type {import('next').NextConfig} */
// Konfigurasi Next.js untuk aplikasi UMKM Kue
const nextConfig = {
  // Konfigurasi untuk komponen Next.js Image
  images: {
    unoptimized: true,
  },
  compress: true,
  poweredByHeader: false,
}

module.exports = nextConfig
