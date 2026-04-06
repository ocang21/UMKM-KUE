// Directive untuk menandai ini sebagai Client Component (berjalan di browser)
'use client';

// Import hooks React untuk state dan side effects
import { useState, useEffect } from "react";
// Import toast untuk notifikasi user
import toast from "react-hot-toast";

// Props interface untuk component PaymentAccountForm
interface PaymentAccountFormProps {
  account: {
    id: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
  } | null;
  onClose: () => void;
}

export default function PaymentAccountForm({ account, onClose }: PaymentAccountFormProps) {
  // State untuk menyimpan data form (nama bank, nomor, pemilik)
  const [formData, setFormData] = useState({
    bankName: "",
    accountNumber: "",
    accountName: "",
  });
  // State untuk status loading saat submit form
  const [isLoading, setIsLoading] = useState(false);

  // Effect untuk populate form data saat mode edit
  useEffect(() => {
    if (account) {
      // Isi form dengan data rekening yang akan di-edit
      setFormData({
        bankName: account.bankName,
        accountNumber: account.accountNumber,
        accountName: account.accountName,
      });
    }
  }, [account]);

  // Handler untuk submit form (tambah atau edit rekening)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Tentukan URL dan method berdasarkan mode (edit/tambah)
      const url = account ? `/api/payment-accounts/${account.id}` : "/api/payment-accounts";
      const method = account ? "PUT" : "POST";

      // Kirim request JSON ke API
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menyimpan data");
      }

      // Tampilkan notifikasi sukses dan tutup modal
      toast.success(account ? "Rekening berhasil diupdate" : "Rekening berhasil ditambahkan");
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
      <div className="bg-white rounded-lg sm:rounded-xl shadow-2xl max-w-lg w-full">
        {/* Header modal dengan judul dan tombol close */}
        <div className="bg-white border-b px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center rounded-t-lg sm:rounded-t-xl">
          <h2 className="text-xl sm:text-2xl font-display font-bold text-gray-800">
            {account ? "Edit Rekening" : "Tambah Rekening Baru"}
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
          {/* Input nama bank */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Nama Bank *
            </label>
            <input
              type="text"
              required
              value={formData.bankName}
              onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Contoh: BCA, Mandiri, BNI"
            />
          </div>

          {/* Input nomor rekening */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Nomor Rekening *
            </label>
            <input
              type="text"
              required
              value={formData.accountNumber}
              onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Contoh: 1234567890"
            />
          </div>

          {/* Input nama pemilik rekening */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Atas Nama *
            </label>
            <input
              type="text"
              required
              value={formData.accountName}
              onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Contoh: John Doe"
            />
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
