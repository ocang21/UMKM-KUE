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
    // Container utama dengan gradient background dan centered layout
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-bakery-cream via-bakery-peach to-bakery-pink">
      {/* Card container dengan max width */}
      <div className="w-full max-w-md">
        {/* Card dengan shadow dan rounded corners */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header: Logo dan judul */}
          <div className="text-center mb-8">
            {/* Judul dengan emoji dan nama toko */}
            <h1 className="text-3xl font-display font-bold text-primary-600 mb-2">
              🧁 Toko Kue UMKM
            </h1>
            {/* Subtitle */}
            <p className="text-gray-600">Daftar Akun Penjual</p>
          </div>

          {/* Form registrasi dengan onSubmit handler */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input Nama Lengkap */}
            <div>
              {/* Label input */}
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap
              </label>
              {/* Input field untuk nama lengkap */}
              <input
                type="text"
                required // Field wajib diisi
                value={formData.name} // Controlled input
                // Update state saat user mengetik
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            {/* Input Email */}
            <div>
              {/* Label input */}
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              {/* Input field untuk email (type email untuk validasi email) */}
              <input
                type="email"
                required // Field wajib diisi
                value={formData.email} // Controlled input
                // Update state saat user mengetik
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                placeholder="nama@email.com"
              />
            </div>

            {/* Input Password */}
            <div>
              {/* Label input */}
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              {/* Input field untuk password */}
              <input
                type="password"
                required // Field wajib diisi
                value={formData.password} // Controlled input
                // Update state saat user mengetik
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                placeholder="Minimal 6 karakter"
                minLength={6} // Validasi HTML5: minimal 6 karakter
              />
            </div>

            {/* Input Konfirmasi Password */}
            <div>
              {/* Label input */}
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Konfirmasi Password
              </label>
              {/* Input field untuk konfirmasi password */}
              <input
                type="password"
                required // Field wajib diisi
                value={formData.confirmPassword} // Controlled input
                // Update state saat user mengetik
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                placeholder="Ulangi password"
              />
            </div>

            {/* Tombol submit registrasi */}
            <button
              type="submit"
              disabled={isLoading} // Disable saat loading
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {/* Text berubah saat loading */}
              {isLoading ? "Mendaftar..." : "Daftar"}
            </button>
          </form>

          {/* Link ke halaman login jika sudah punya akun */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-primary-600 font-semibold hover:text-primary-700">
              Login di sini
            </Link>
          </div>

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
