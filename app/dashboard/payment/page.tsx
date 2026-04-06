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
    <div className="max-w-4xl mx-auto px-3 sm:px-4">
      {/* Header dengan judul dan tombol tambah */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-800">Rekening Pembayaran</h1>
        <button
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition shadow-lg text-sm sm:text-base"
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
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-8 sm:p-12 text-center">
          <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">💳</div>
          <p className="text-gray-600 text-base sm:text-lg">Belum ada rekening. Tambahkan rekening pembayaran Anda!</p>
        </div>
      ) : (
        // List rekening dengan vertical spacing
        <div className="space-y-3 sm:space-y-4">
          {accounts.map((account) => (
            // Card untuk setiap rekening
            <div key={account.id} className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0">
                {/* Info rekening */}
                <div className="flex-1 w-full">
                  {/* Nama bank */}
                  <h3 className="font-display font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-gray-800">
                    {account.bankName}
                  </h3>
                  <div className="space-y-1.5 sm:space-y-2 text-gray-600 text-sm sm:text-base">
                    {/* Nomor rekening */}
                    <p>
                      <span className="font-semibold">Nomor Rekening:</span>{" "}
                      <span className="text-base sm:text-lg font-mono break-all">{account.accountNumber}</span>
                    </p>
                    {/* Nama pemilik rekening */}
                    <p>
                      <span className="font-semibold">Atas Nama:</span>{" "}
                      <span className="text-base sm:text-lg">{account.accountName}</span>
                    </p>
                  </div>
                </div>
                {/* Tombol Edit dan Hapus */}
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleEdit(account)}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold rounded-lg transition text-sm sm:text-base"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(account.id)}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-semibold rounded-lg transition text-sm sm:text-base"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
