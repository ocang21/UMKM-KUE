// Directive untuk menandai ini sebagai Client Component (berjalan di browser)
'use client';

// Import hooks React untuk state dan side effects
import { useState, useEffect } from "react";
// Import komponen SharedImage untuk menampilkan gambar kue
import SharedImage from "@/components/SharedImage";
// Import toast untuk notifikasi user
import toast from "react-hot-toast";
// Import form modal untuk tambah/edit kue
import CakeForm from "@/components/dashboard/CakeForm";

// Interface untuk tipe data Cake
interface Cake {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
}

export default function CakesPage() {
  // State untuk menyimpan daftar kue dari database
  const [cakes, setCakes] = useState<Cake[]>([]);
  // State untuk status loading saat fetch data
  const [isLoading, setIsLoading] = useState(true);
  // State untuk menampilkan/menyembunyikan form modal
  const [showForm, setShowForm] = useState(false);
  // State untuk menyimpan kue yang sedang di-edit (null = mode tambah)
  const [editingCake, setEditingCake] = useState<Cake | null>(null);

  // Fungsi untuk fetch semua data kue dari API
  const fetchCakes = async () => {
    try {
      // Panggil endpoint GET /api/cakes
      const res = await fetch("/api/cakes");
      if (!res.ok) throw new Error("Gagal memuat data");
      // Parse response JSON dan simpan ke state
      const data = await res.json();
      setCakes(data);
    } catch (error) {
      // Tampilkan notifikasi error jika gagal
      toast.error("Gagal memuat menu kue");
    } finally {
      // Set loading false setelah fetch selesai (sukses/gagal)
      setIsLoading(false);
    }
  };

  // Effect untuk fetch data kue saat komponen pertama kali dimount
  useEffect(() => {
    fetchCakes();
  }, []);

  // Fungsi untuk menghapus kue berdasarkan ID
  const handleDelete = async (id: string) => {
    // Konfirmasi dulu sebelum hapus
    if (!confirm("Yakin ingin menghapus kue ini?")) return;

    try {
      // Kirim DELETE request ke API
      const res = await fetch(`/api/cakes/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Delete error:", errorData);
        throw new Error(errorData.error || "Gagal menghapus");
      }

      // Tampilkan notifikasi sukses dan refresh daftar kue
      toast.success("Kue berhasil dihapus");
      fetchCakes();
    } catch (error: any) {
      console.error("Delete cake error:", error);
      toast.error(error.message || "Gagal menghapus kue");
    }
  };

  // Fungsi untuk buka form edit dengan data kue yang dipilih
  const handleEdit = (cake: Cake) => {
    setEditingCake(cake);
    setShowForm(true);
  };

  // Fungsi untuk menutup form dan refresh data
  const handleFormClose = () => {
    setShowForm(false);
    setEditingCake(null);
    fetchCakes();
  };

  // Tampilkan loading indicator saat fetch data
  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  // Render halaman daftar kue
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header dengan judul dan tombol tambah */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-cream-300">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-primary-900">Katalog Menu Kue</h1>
          <p className="text-neutral-600 text-xs sm:text-sm mt-0.5">Kelola daftar varian kue yang tampil pada etalase toko.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary text-xs uppercase tracking-wider py-2.5 px-5 shadow-warm-sm"
        >
          + Tambah Menu Baru
        </button>
      </div>

      {/* Modal form untuk tambah/edit kue */}
      {showForm && (
        <CakeForm
          cake={editingCake}
          onClose={handleFormClose}
        />
      )}

      {/* Tampilkan empty state jika belum ada kue */}
      {cakes.length === 0 ? (
        <div className="bg-white rounded-xl border border-cream-300 shadow-warm-sm p-10 text-center max-w-md mx-auto">
          <div className="text-4xl mb-3">🍰</div>
          <h3 className="text-base font-display font-bold text-primary-900 mb-1">Belum Ada Menu</h3>
          <p className="text-neutral-500 text-xs mb-4">Tambahkan menu pertama Anda agar pelanggan bisa memesan.</p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary text-xs uppercase tracking-wider py-2 px-4"
          >
            Tambah Menu Sekarang
          </button>
        </div>
      ) : (
        // Grid layout untuk daftar kue (responsive)
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {cakes.map((cake) => (
            <div key={cake.id} className="bg-white rounded-xl border border-cream-300 shadow-warm-sm overflow-hidden flex flex-col justify-between hover:shadow-warm-md transition">
              <div>
                {/* Gambar kue dengan badge status */}
                <div className="relative aspect-[4/3] w-full bg-cream-100">
                  <SharedImage
                    src={cake.imageUrl}
                    alt={cake.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2.5 right-2.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase ${
                      cake.isAvailable 
                        ? "bg-green-100 text-green-800 border border-green-200" 
                        : "bg-red-100 text-red-800 border border-red-200"
                    }`}>
                      {cake.isAvailable ? "Ready" : "Tidak Ready"}
                    </span>
                  </div>
                </div>
                {/* Info kue */}
                <div className="p-4">
                  <h3 className="font-display font-semibold text-base text-primary-900 truncate">{cake.name}</h3>
                  <p className="text-primary-700 font-bold text-base mt-0.5 font-sans">
                    Rp {cake.price.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              {/* Tombol Edit dan Hapus */}
              <div className="p-4 pt-0 flex gap-2 border-t border-cream-100 mt-2">
                <button
                  onClick={() => handleEdit(cake)}
                  className="flex-1 py-1.5 px-3 bg-cream-100 hover:bg-cream-200 text-primary-900 font-semibold rounded-lg transition text-xs uppercase tracking-wider"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cake.id)}
                  className="flex-1 py-1.5 px-3 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-lg transition text-xs uppercase tracking-wider"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
