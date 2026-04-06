// Import tipe Config dari Tailwind CSS
import type { Config } from "tailwindcss";

// Konfigurasi Tailwind CSS untuk aplikasi UMKM Kue
const config: Config = {
  // Lokasi file yang menggunakan class Tailwind
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Custom color palette dengan tema warm/cozy untuk toko kue
      colors: {
        // Primary color: Orange palette untuk brand identity
        primary: {
          50: '#fff8f0',
          100: '#ffecd9',
          200: '#ffd4a8',
          300: '#ffb871',
          400: '#ff974d',
          500: '#ff7a29', // Main brand color
          600: '#e85d0f',
          700: '#c24609',
          800: '#9a380c',
          900: '#7a2f0d',
        },
        // Accent colors untuk variasi UI
        accent: {
          brown: '#8B4513',  // Coklat untuk elemen kue
          tan: '#D2B48C',    // Tan untuk background lembut
          cream: '#FFFDD0',  // Cream untuk highlight
          rose: '#FFE4E1',   // Rose untuk aksen manis
        },
        // Neutral colors untuk teks dan background
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        }
      },
      // Custom font families dari Google Fonts
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],      // Body text
        display: ['var(--font-poppins)', 'system-ui', 'sans-serif'], // Headings
      },
      // Custom border radius untuk desain natural/organic
      borderRadius: {
        'natural': '6px',  // Sudut lembut untuk card
        'soft': '10px',    // Sudut lebih rounded untuk button
      },
    },
  },
  plugins: [], // Tidak ada plugin tambahan
};
export default config;
