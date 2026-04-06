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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
      {/* Container modal */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header modal dengan judul dan tombol close */}
        <div className="sticky top-0 bg-white border-b px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-display font-bold text-gray-800">
            {cake ? "Edit Kue" : "Tambah Kue Baru"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 active:text-gray-900 text-2xl sm:text-3xl"
          >
            ×
          </button>
        </div>

        {/* Form content */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Input nama kue */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Nama Kue *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Contoh: Brownies Coklat"
            />
          </div>

          {/* Input harga */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Harga (Rp) *
            </label>
            <input
              type="number"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Contoh: 50000"
              min="0"
            />
          </div>

          {/* Input foto kue dengan preview */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Foto Kue {!cake && "*"}
            </label>
            <input
              type="file"
              accept="image/*"
              required={!cake}
              onChange={handleImageChange}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500"
            />
            {/* Preview gambar jika ada */}
            {imagePreview && (
              <div className="mt-2 sm:mt-3">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-40 sm:h-48 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Checkbox untuk status ready/tidak ready */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isAvailable"
              checked={formData.isAvailable}
              onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
              className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500 rounded focus:ring-primary-500"
            />
            <label htmlFor="isAvailable" className="ml-2 sm:ml-3 text-xs sm:text-sm font-medium text-gray-700">
              Kue tersedia / ready
            </label>
          </div>

          {/* Tombol Batal dan Simpan */}
          <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 active:bg-gray-100 transition text-sm sm:text-base"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white font-semibold rounded-lg transition disabled:opacity-50 text-sm sm:text-base"
            >
              {isLoading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
