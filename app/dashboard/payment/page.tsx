// Directive untuk menandai ini sebagai Client Component (berjalan di browser)
'use client';

// Import hooks React untuk state dan side effects
import { useState, useEffect } from "react";
// Import toast untuk notifikasi user
import toast from "react-hot-toast";
// Import form modal untuk tambah/edit rekening
import PaymentAccountForm from "@/components/dashboard/PaymentAccountForm";

// Interface untuk tipe data PaymentAccount (rekening pembayaran)
interface PaymentAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export default function PaymentPage() {
  // State untuk menyimpan daftar rekening pembayaran dari database
  const [accounts, setAccounts] = useState<PaymentAccount[]>([]);
  // State untuk status loading saat fetch data
  const [isLoading, setIsLoading] = useState(true);
  // State untuk menampilkan/menyembunyikan form modal
  const [showForm, setShowForm] = useState(false);
  // State untuk menyimpan rekening yang sedang di-edit (null = mode tambah)
  const [editingAccount, setEditingAccount] = useState<PaymentAccount | null>(null);

  // Fungsi untuk fetch semua rekening pembayaran dari API
  const fetchAccounts = async () => {
    try {
      // Panggil endpoint GET /api/payment-accounts
      const res = await fetch("/api/payment-accounts");
      if (!res.ok) throw new Error("Gagal memuat data");
      // Parse response JSON dan simpan ke state
      const data = await res.json();
      setAccounts(data);
    } catch (error) {
      // Tampilkan notifikasi error jika gagal
      toast.error("Gagal memuat data rekening");
    } finally {
      // Set loading false setelah fetch selesai
      setIsLoading(false);
    }
  };

  // Effect untuk fetch data rekening saat komponen pertama kali dimount
  useEffect(() => {
    fetchAccounts();
  }, []);

  // Fungsi untuk menghapus rekening berdasarkan ID
  const handleDelete = async (id: string) => {
    // Konfirmasi dulu sebelum hapus
    if (!confirm("Yakin ingin menghapus rekening ini?")) return;

    try {
      // Kirim DELETE request ke API
      const res = await fetch(`/api/payment-accounts/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Gagal menghapus");

      // Tampilkan notifikasi sukses dan refresh daftar
      toast.success("Rekening berhasil dihapus");
      fetchAccounts();
    } catch (error) {
      toast.error("Gagal menghapus rekening");
    }
  };

  // Fungsi untuk buka form edit dengan data rekening yang dipilih
  const handleEdit = (account: PaymentAccount) => {
    setEditingAccount(account);
    setShowForm(true);
  };

  // Fungsi untuk menutup form dan refresh data
  const handleFormClose = () => {
    setShowForm(false);
    setEditingAccount(null);
    fetchAccounts();
  };

  // Tampilkan loading indicator saat fetch data
  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  // Render halaman daftar rekening pembayaran
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header dengan judul dan tombol tambah */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-cream-300">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-primary-900">Rekening Pembayaran</h1>
          <p className="text-neutral-600 text-xs sm:text-sm mt-0.5">Atur nomor rekening tujuan transfer yang akan dilihat oleh pembeli.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary text-xs uppercase tracking-wider py-2.5 px-5 shadow-warm-sm"
        >
          + Tambah Rekening
        </button>
      </div>

      {/* Modal form untuk tambah/edit rekening */}
      {showForm && (
        <PaymentAccountForm
          account={editingAccount}
          onClose={handleFormClose}
        />
      )}

      {/* Tampilkan empty state jika belum ada rekening */}
      {accounts.length === 0 ? (
        <div className="bg-white rounded-xl border border-cream-300 shadow-warm-sm p-12 text-center max-w-md mx-auto">
          <div className="text-4xl mb-3">💳</div>
          <h3 className="text-base font-display font-bold text-primary-900 mb-1">Belum Ada Rekening</h3>
          <p className="text-neutral-500 text-xs mb-4">Tambahkan rekening bank agar pembeli dapat melakukan pembayaran via transfer.</p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary text-xs uppercase tracking-wider py-2 px-4"
          >
            Tambah Rekening Sekarang
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {accounts.map((account) => (
            <div key={account.id} className="vintage-frame bg-white rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-1">
                <span className="text-[10px] font-semibold tracking-widest uppercase text-accent-amber block mb-1">
                  Rekening Aktif
                </span>
                <h3 className="font-display font-bold text-xl text-primary-900 mb-2">
                  {account.bankName}
                </h3>
                <div className="space-y-1 text-xs sm:text-sm text-neutral-700">
                  <p>
                    <span className="text-neutral-500">Nomor Rekening:</span>{" "}
                    <span className="font-mono text-base font-bold text-primary-800 tracking-wider break-all">{account.accountNumber}</span>
                  </p>
                  <p>
                    <span className="text-neutral-500">Atas Nama:</span>{" "}
                    <span className="font-semibold text-neutral-900">{account.accountName}</span>
                  </p>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-cream-200">
                <button
                  onClick={() => handleEdit(account)}
                  className="flex-1 sm:flex-none px-4 py-2 bg-cream-100 hover:bg-cream-200 text-primary-900 font-semibold rounded-lg transition text-xs uppercase tracking-wider"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(account.id)}
                  className="flex-1 sm:flex-none px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-lg transition text-xs uppercase tracking-wider"
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
