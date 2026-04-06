// Konfigurasi PostCSS untuk memproses CSS
// PostCSS adalah tool untuk transform CSS dengan JavaScript plugins
module.exports = {
  plugins: {
    tailwindcss: {},    // Plugin untuk compile Tailwind CSS classes
    autoprefixer: {},   // Plugin untuk menambahkan vendor prefixes otomatis (-webkit-, -moz-, etc)
  },
}
