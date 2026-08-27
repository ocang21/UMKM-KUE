// Import tipe Config dari Tailwind CSS
import type { Config } from "tailwindcss";

// Konfigurasi Tailwind CSS untuk tema Warm Artisan Bakery
const config: Config = {
  // Lokasi file yang menggunakan class Tailwind
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Custom color palette dengan tema Warm Artisan Bakery (Cream & Deep Cocoa)
      colors: {
        // Primary color: Warm Cocoa / Deep Brown palette
        primary: {
          50: '#FAF6F0',
          100: '#F4ECE1',
          200: '#E8D7C3',
          300: '#D5BC9F',
          400: '#B89773',
          500: '#8B5E3C', // Warm Terracotta / Milk Chocolate
          600: '#6F472B', // Rich Cocoa
          700: '#56351F', // Deep Chocolate
          800: '#3D2516', // Dark Espresso
          900: '#26170E', // Roasted Cocoa
        },
        // Warm Cream & Linen palette untuk background dan card lembut
        cream: {
          50: '#FDFBF7',  // Main background (warm linen)
          100: '#FAF5EC', // Secondary background (soft almond)
          200: '#F3EADC', // Light border & cards
          300: '#E6D7C3', // Divider & accent lines
          400: '#D4C0A8',
          500: '#BEA68C',
        },
        // Accent colors untuk sentuhan mewah dan manis
        accent: {
          gold: '#C89F6E',    // Warm Honey Gold
          goldLight: '#E8CA9D',
          tan: '#D2B48C',     // Tan warm
          amber: '#B8860B',   // Dark goldenrod
          warmWhite: '#FFFDF9',
        },
        // Neutral colors dengan tone hangat (bukan gray dingin)
        neutral: {
          50: '#FAF8F5',
          100: '#F5F2EC',
          200: '#E8E4DC',
          300: '#D6D0C5',
          400: '#A39C90',
          500: '#787165',
          600: '#575147',
          700: '#3D3830',
          800: '#292520',
          900: '#171512',
        }
      },
      // Custom font families (Playfair Display untuk headings, Inter untuk body)
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      // Custom border radius untuk desain artisan
      borderRadius: {
        'natural': '8px',
        'soft': '14px',
        'pill': '9999px',
      },
      // Custom box shadow halus dan hangat
      boxShadow: {
        'warm-sm': '0 1px 3px rgba(61, 37, 22, 0.06), 0 1px 2px rgba(61, 37, 22, 0.04)',
        'warm-md': '0 4px 14px rgba(61, 37, 22, 0.08), 0 2px 6px rgba(61, 37, 22, 0.04)',
        'warm-lg': '0 10px 25px rgba(61, 37, 22, 0.10), 0 4px 10px rgba(61, 37, 22, 0.05)',
        'warm-xl': '0 20px 35px rgba(61, 37, 22, 0.12), 0 8px 15px rgba(61, 37, 22, 0.06)',
      },
      // Keyframe Animasi Melayang Alami & Fleksibel
      keyframes: {
        floatCard1: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) rotate(-6deg)' },
          '25%': { transform: 'translate3d(4px, -12px, 0) rotate(-4deg)' },
          '50%': { transform: 'translate3d(0, -22px, 0) rotate(-2deg)' },
          '75%': { transform: 'translate3d(-4px, -10px, 0) rotate(-4deg)' },
        },
        floatCard2: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) rotate(6deg)' },
          '25%': { transform: 'translate3d(-5px, -14px, 0) rotate(4deg)' },
          '50%': { transform: 'translate3d(0, -24px, 0) rotate(1deg)' },
          '75%': { transform: 'translate3d(4px, -12px, 0) rotate(3deg)' },
        },
        floatCard3: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) rotate(4deg)' },
          '25%': { transform: 'translate3d(5px, -10px, 0) rotate(2deg)' },
          '50%': { transform: 'translate3d(0, -20px, 0) rotate(-1deg)' },
          '75%': { transform: 'translate3d(-3px, -8px, 0) rotate(1deg)' },
        },
        floatCard4: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) rotate(-6deg)' },
          '25%': { transform: 'translate3d(-4px, -12px, 0) rotate(-4deg)' },
          '50%': { transform: 'translate3d(0, -22px, 0) rotate(-1deg)' },
          '75%': { transform: 'translate3d(5px, -9px, 0) rotate(-3deg)' },
        },
      },
      animation: {
        'float-card-1': 'floatCard1 6.5s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite',
        'float-card-2': 'floatCard2 7.2s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite 0.6s',
        'float-card-3': 'floatCard3 7.8s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite 1.2s',
        'float-card-4': 'floatCard4 6.8s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite 0.3s',
      },
    },
  },
  plugins: [],
};
export default config;
