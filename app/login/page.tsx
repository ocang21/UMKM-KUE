// Directive untuk menandakan komponen ini adalah Client Component
// Diperlukan karena menggunakan hooks dan form interactions
'use client';

// Import Link dari Next.js untuk navigasi client-side
import Link from "next/link";
// Import useRouter untuk navigasi programmatic setelah login
import { useRouter } from "next/navigation";
// Import useState untuk state management form
import { useState } from "react";
// Import signIn dari NextAuth untuk autentikasi
import { signIn } from "next-auth/react";
// Import toast untuk menampilkan notifikasi
import toast from "react-hot-toast";

// Komponen halaman login untuk penjual
// Menangani autentikasi menggunakan NextAuth credentials provider
export default function LoginPage() {
  // Hook router untuk redirect setelah login sukses
  const router = useRouter();
  // State untuk menyimpan data form login (email dan password)
  const [formData, setFormData] = useState({
    email: "",      // Email atau username
    password: "",   // Password user
  });
  // State untuk tracking loading state saat proses login
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi untuk menangani submit form login
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent default form submission behavior (page refresh)
    e.preventDefault();
    // Set loading state menjadi true untuk disable button
    setIsLoading(true);

    try {
      // Panggil signIn dari NextAuth dengan credentials provider
      const result = await signIn("credentials", {
        email: formData.email,       // Email/username dari form
        password: formData.password, // Password dari form
        redirect: false,             // Jangan auto redirect, handle manual
      });

      // Cek apakah ada error dari proses login
      if (result?.error) {
        // Tampilkan error message dari server
        toast.error(result.error);
      } else {
        // Jika sukses, tampilkan notifikasi sukses
        toast.success("Login berhasil!");
        // Redirect ke halaman dashboard
        router.push("/dashboard");
        // Refresh router untuk update session state
        router.refresh();
      }
    } catch (error) {
      // Tangani error unexpected (network error, dll)
      toast.error("Terjadi kesalahan. Silakan coba lagi");
    } finally {
      // Set loading menjadi false setelah selesai (sukses atau error)
      setIsLoading(false);
    }
  };

  // Return JSX - Tampilan UI halaman login
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-cream-100 bg-artisan-dots selection:bg-accent-gold selection:text-white">
      <div className="w-full max-w-md">
        <div className="vintage-frame bg-white rounded-2xl p-8 sm:p-10 text-left">
          {/* Header: Logo dan judul */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full overflow-hidden border-2 border-accent-gold shadow-warm-sm bg-cream-100">
              <img
                src="/logo.jpeg"
                alt="Logo Toko Kue UMKM"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-2xl font-display font-bold text-primary-900 tracking-tight">
              Toko Kue UMKM
            </h1>
            <p className="text-xs uppercase tracking-widest text-accent-amber font-semibold mt-1">
              Portal Pengelola Toko
            </p>
          </div>

          {/* Form login dengan onSubmit handler */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                Email / Username
              </label>
              <input
                type="text"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-cream-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition bg-cream-50/50"
                placeholder="Masukkan email Anda"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-cream-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition bg-cream-50/50"
                placeholder="Masukkan password"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-3 text-xs uppercase tracking-wider shadow-warm-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading && (
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isLoading ? "Memproses..." : "Masuk ke Dashboard"}
              </button>
            </div>
          </form>

          {/* Link kembali ke beranda */}
          <div className="mt-8 pt-4 border-t border-cream-200 text-center">
            <Link href="/" className="text-xs font-semibold text-primary-800 hover:text-accent-amber transition tracking-wide">
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
