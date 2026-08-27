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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in duration-200">
      {/* Container modal */}
      <div className="bg-white rounded-2xl shadow-warm-xl max-w-md w-full border border-cream-300">
        {/* Header modal dengan judul dan tombol close */}
        <div className="bg-white/95 border-b border-cream-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <div>
            <h2 className="text-xl font-display font-bold text-primary-900">
              {account ? "Edit Rekening" : "Tambah Rekening Baru"}
            </h2>
            <p className="text-[11px] uppercase tracking-wider text-accent-amber font-semibold">
              Metode Pembayaran
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
          {/* Input nama bank */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
              Nama Bank / E-Wallet *
            </label>
            <input
              type="text"
              required
              value={formData.bankName}
              onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-cream-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition bg-cream-50/50"
              placeholder="Contoh: BCA / Mandiri / GoPay"
            />
          </div>

          {/* Input nomor rekening */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
              Nomor Rekening / Akun *
            </label>
            <input
              type="text"
              required
              value={formData.accountNumber}
              onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-cream-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition bg-cream-50/50 font-mono"
              placeholder="Contoh: 1234567890"
            />
          </div>

          {/* Input nama pemilik rekening */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
              Nama Pemilik Rekening *
            </label>
            <input
              type="text"
              required
              value={formData.accountName}
              onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-cream-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition bg-cream-50/50"
              placeholder="Contoh: Siti Nurhaliza"
            />
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
              {isLoading ? "Menyimpan..." : "Simpan Rekening"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
