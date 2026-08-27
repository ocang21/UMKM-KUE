// Directive untuk menandakan komponen ini adalah Client Component
// Diperlukan karena menggunakan hooks dan form interactions
'use client';

// Import Link dari Next.js untuk navigasi client-side
import Link from "next/link";
// Import useRouter untuk navigasi programmatic setelah registrasi berhasil
import { useRouter } from "next/navigation";
// Import useState untuk state management form
import { useState } from "react";
// Import toast untuk menampilkan notifikasi
import toast from "react-hot-toast";

// Komponen halaman registrasi untuk penjual baru
// Menangani pembuatan akun baru melalui API
export default function RegisterPage() {
  // Hook router untuk redirect setelah registrasi berhasil
  const router = useRouter();
  // State untuk menyimpan data form registrasi
  const [formData, setFormData] = useState({
    name: "",             // Nama lengkap user
    email: "",            // Email user
    password: "",         // Password user
    confirmPassword: ""   // Konfirmasi password untuk validasi
  });
  // State untuk tracking loading state saat proses registrasi
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi untuk menangani submit form registrasi
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent default form submission behavior (page refresh)
    e.preventDefault();

    // Validasi: Cek apakah password dan konfirmasi password cocok
    if (formData.password !== formData.confirmPassword) {
      toast.error("Password tidak cocok");
      return; // Stop execution jika validasi gagal
    }

    // Set loading state menjadi true untuk disable button
    setIsLoading(true);

    try {
      // Kirim POST request ke API register endpoint
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set content type sebagai JSON
        },
        // Body berisi data user yang akan didaftarkan
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      // Parse response JSON dari API
      const data = await res.json();

      // Cek apakah response tidak OK (status code bukan 2xx)
      if (!res.ok) {
        // Tampilkan error message dari server atau default message
        toast.error(data.error || "Registrasi gagal");
        return; // Stop execution jika ada error
      }

      // Jika sukses, tampilkan notifikasi sukses
      toast.success("Registrasi berhasil! Silakan login");
      // Redirect ke halaman login
      router.push("/login");
    } catch (error) {
      // Tangani error unexpected (network error, dll)
      toast.error("Terjadi kesalahan. Silakan coba lagi");
    } finally {
      // Set loading menjadi false setelah selesai (sukses atau error)
      setIsLoading(false);
    }
  };

  // Return JSX - Tampilan UI halaman registrasi
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
              Daftar Akun Pengelola Toko
            </p>
          </div>

          {/* Form registrasi dengan onSubmit handler */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-cream-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition bg-cream-50/50"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-cream-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition bg-cream-50/50"
                placeholder="nama@email.com"
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
                placeholder="Minimal 6 karakter"
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                Konfirmasi Password
              </label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-cream-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition bg-cream-50/50"
                placeholder="Ulangi password"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-3 text-xs uppercase tracking-wider shadow-warm-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Mendaftarkan..." : "Daftar Sekarang"}
              </button>
            </div>
          </form>

          {/* Link ke halaman login */}
          <div className="mt-6 text-center text-xs text-neutral-600">
            Sudah punya akun pengelola?{" "}
            <Link href="/login" className="text-primary-800 font-semibold hover:text-accent-amber underline">
              Login di sini
            </Link>
          </div>

          {/* Link kembali ke beranda */}
          <div className="mt-6 pt-4 border-t border-cream-200 text-center">
            <Link href="/" className="text-xs font-semibold text-primary-800 hover:text-accent-amber transition tracking-wide">
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
