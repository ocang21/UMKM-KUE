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
    // Container utama dengan centered layout
    <div className="min-h-screen flex items-center justify-center p-4 bg-neutral-50">
      {/* Card container dengan max width */}
      <div className="w-full max-w-md">
        {/* Card dengan border dan shadow */}
        <div className="card-natural p-8">
          {/* Header: Logo dan judul */}
          <div className="text-center mb-8">
            {/* Icon emoji kue */}
            <div className="text-4xl mb-3">🧁</div>
            {/* Judul - Nama toko */}
            <h1 className="text-2xl font-display font-bold text-neutral-900 mb-1">
              Toko Kue UMKM
            </h1>
            {/* Subtitle - Portal Penjual */}
            <p className="text-neutral-600 text-sm">Portal Penjual</p>
          </div>

          {/* Form login dengan onSubmit handler */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Email/Username */}
            <div>
              {/* Label input */}
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Email / Username
              </label>
              {/* Input field untuk email/username */}
              <input
                type="text"
                required // Field wajib diisi
                value={formData.email} // Controlled input
                // Update state saat user mengetik
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 text-sm rounded-natural border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                placeholder="Masukkan email atau username"
              />
            </div>

            {/* Input Password */}
            <div>
              {/* Label input */}
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Password
              </label>
              {/* Input field untuk password (type password untuk hide text) */}
              <input
                type="password"
                required // Field wajib diisi
                value={formData.password} // Controlled input
                // Update state saat user mengetik
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2.5 text-sm rounded-natural border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                placeholder="Masukkan password"
              />
            </div>

            {/* Tombol submit login */}
            <button
              type="submit"
              disabled={isLoading} // Disable saat loading
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {/* Tampilkan spinner hanya saat loading */}
              {isLoading && (
                // SVG spinner dengan animasi rotate
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {/* Text berubah saat loading */}
              {isLoading ? "Memproses..." : "Login"}
            </button>
          </form>

          {/* Link kembali ke beranda */}
          <div className="mt-6 text-center">
            <Link href="/" className="text-primary-600 text-sm hover:text-primary-700">
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
