// Directive untuk menandai ini sebagai Client Component (berjalan di browser)
'use client';

// Import hooks React untuk state dan side effects
import { useState, useEffect } from "react";
// Import toast untuk notifikasi user
import toast from "react-hot-toast";

// Props interface untuk component CakeForm
interface CakeFormProps {
  cake: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    isAvailable: boolean;
  } | null;
  onClose: () => void;
}

export default function CakeForm({ cake, onClose }: CakeFormProps) {
  // State untuk menyimpan data form (nama, harga, status ready)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    isAvailable: true,
  });
  // State untuk menyimpan file gambar yang dipilih
  const [imageFile, setImageFile] = useState<File | null>(null);
  // State untuk menyimpan URL preview gambar
  const [imagePreview, setImagePreview] = useState<string>("");
  // State untuk status loading saat submit form
  const [isLoading, setIsLoading] = useState(false);

  // Effect untuk populate form data saat mode edit
  useEffect(() => {
    if (cake) {
      // Isi form dengan data kue yang akan di-edit
      setFormData({
        name: cake.name,
        price: cake.price.toString(),
        isAvailable: cake.isAvailable,
      });
      // Tampilkan gambar existing sebagai preview
      setImagePreview(cake.imageUrl);
    }
  }, [cake]);

  // Handler untuk mengubah gambar dan generate preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simpan file ke state
      setImageFile(file);
      // Baca file sebagai data URL untuk preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler untuk submit form (tambah atau edit kue)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Buat FormData untuk upload file dan data lainnya
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("isAvailable", formData.isAvailable.toString());
      
      // Tambahkan file gambar jika ada
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      // Tentukan URL dan method berdasarkan mode (edit/tambah)
      const url = cake ? `/api/cakes/${cake.id}` : "/api/cakes";
      const method = cake ? "PUT" : "POST";

      // Kirim request ke API
      const res = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menyimpan data");
      }

      // Tampilkan notifikasi sukses dan tutup modal
      toast.success(cake ? "Kue berhasil diupdate" : "Kue berhasil ditambahkan");
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Render modal form
  return (
    // Overlay modal dengan backdrop gelap
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in duration-200">
      {/* Container modal */}
      <div className="bg-white rounded-2xl shadow-warm-xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-cream-300">
        {/* Header modal dengan judul dan tombol close */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-cream-200 px-6 py-4 flex justify-between items-center z-10">
          <div>
            <h2 className="text-xl font-display font-bold text-primary-900">
              {cake ? "Edit Data Kue" : "Tambah Menu Kue"}
            </h2>
            <p className="text-[11px] uppercase tracking-wider text-accent-amber font-semibold">
              Katalog Toko
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-cream-100 text-primary-800 hover:bg-cream-200 flex items-center justify-center text-sm font-bold transition"
          >
            ✕
          </button>
        </div>

        {/* Form content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Input nama kue */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
              Nama Kue *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-cream-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition bg-cream-50/50"
              placeholder="Contoh: Brownies Fudge Coklat"
            />
          </div>

          {/* Input harga */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
              Harga (Rp) *
            </label>
            <input
              type="number"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-cream-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition bg-cream-50/50"
              placeholder="Contoh: 45000"
              min="0"
            />
          </div>

          {/* Input foto kue dengan preview */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
              Foto Produk {!cake && "*"}
            </label>
            <input
              type="file"
              accept="image/*"
              required={!cake}
              onChange={handleImageChange}
              className="w-full px-4 py-2 text-xs rounded-lg border border-cream-300 focus:ring-2 focus:ring-primary-500 bg-cream-50/30 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary-800 file:text-cream-50 hover:file:bg-primary-900 file:cursor-pointer"
            />
            {/* Preview gambar jika ada */}
            {imagePreview && (
              <div className="mt-3 p-2 bg-cream-100 rounded-xl border border-cream-200">
                <p className="text-[10px] uppercase font-semibold tracking-wider text-neutral-500 mb-1">Preview Foto:</p>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Checkbox untuk status ready/tidak ready */}
          <div className="flex items-center pt-1">
            <input
              type="checkbox"
              id="isAvailable"
              checked={formData.isAvailable}
              onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
              className="w-4 h-4 text-primary-700 rounded border-cream-300 focus:ring-primary-500 accent-primary-700"
            />
            <label htmlFor="isAvailable" className="ml-2.5 text-xs font-semibold text-neutral-800 cursor-pointer">
              Menu siap dipesan / Ready stock
            </label>
          </div>

          {/* Tombol Batal dan Simpan */}
          <div className="flex gap-2.5 pt-4 border-t border-cream-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 border border-cream-300 text-neutral-700 font-semibold rounded-full hover:bg-cream-100 transition text-xs uppercase tracking-wider"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 px-4 btn-primary transition disabled:opacity-50 text-xs uppercase tracking-wider"
            >
              {isLoading ? "Menyimpan..." : "Simpan Menu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
