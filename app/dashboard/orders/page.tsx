// Directive untuk menandai ini sebagai Client Component (berjalan di browser)
'use client';

// Import hooks React untuk state dan side effects
import { useState, useEffect } from "react";
// Import komponen Next.js Image untuk optimasi gambar
import Image from "next/image";
// Import toast untuk notifikasi user
import toast from "react-hot-toast";

// Interface untuk tipe data Order dengan relasi orderItems
interface Order {
  id: string;
  customerName: string;
  whatsappNumber: string;
  pickupDate: string;
  pickupTime: string;
  paymentProofUrl: string;
  status: string;
  createdAt: string;
  orderItems: {
    id: string;
    quantity: number;
    cakeName: string;
    cakePrice: number;
  }[];
}

export default function OrdersPage() {
  // State untuk menyimpan daftar pesanan dari database
  const [orders, setOrders] = useState<Order[]>([]);
  // State untuk status loading saat fetch data
  const [isLoading, setIsLoading] = useState(true);
  // State untuk menyimpan URL gambar yang dipilih untuk modal preview
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Fungsi untuk fetch semua pesanan dari API
  const fetchOrders = async () => {
    try {
      // Panggil endpoint GET /api/orders
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Gagal memuat data");
      // Parse response JSON dan simpan ke state
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      // Tampilkan notifikasi error jika gagal
      toast.error("Gagal memuat pesanan");
    } finally {
      // Set loading false setelah fetch selesai
      setIsLoading(false);
    }
  };

  // Effect untuk fetch data pesanan saat komponen pertama kali dimount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Fungsi untuk mengubah status pesanan (menunggu/diproses/selesai)
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      // Kirim PATCH request untuk update status
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Gagal mengupdate status");

      // Tampilkan notifikasi sukses dan refresh daftar pesanan
      toast.success("Status pesanan berhasil diupdate");
      fetchOrders();
    } catch (error) {
      toast.error("Gagal mengupdate status");
    }
  };

  // Fungsi helper untuk mendapatkan warna badge berdasarkan status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "menunggu":
        return "bg-yellow-500"; // Kuning untuk pending
      case "diproses":
        return "bg-blue-500"; // Biru untuk sedang diproses
      case "selesai":
        return "bg-green-500"; // Hijau untuk selesai
      default:
        return "bg-gray-500"; // Abu-abu untuk status lain
    }
  };

  // Fungsi untuk menghitung total harga dari semua item dalam pesanan
  const calculateTotal = (orderItems: Order['orderItems']) => {
    return orderItems.reduce((total, item) => total + (item.cakePrice * item.quantity), 0);
  };

  // Tampilkan loading indicator saat fetch data
  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  // Render halaman daftar pesanan
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Judul halaman */}
      <div className="pb-4 border-b border-cream-300">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-primary-900">Daftar Pesanan Masuk</h1>
        <p className="text-neutral-600 text-xs sm:text-sm mt-0.5">Pantau status konfirmasi pesanan dan bukti pembayaran pelanggan.</p>
      </div>

      {/* Tampilkan empty state jika belum ada pesanan */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-cream-300 shadow-warm-sm p-12 text-center max-w-md mx-auto">
          <div className="text-4xl mb-3">📦</div>
          <h3 className="text-base font-display font-bold text-primary-900 mb-1">Belum Ada Pesanan</h3>
          <p className="text-neutral-500 text-xs">Pesanan dari pembeli akan otomatis muncul di sini.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl border border-cream-300 shadow-warm-sm overflow-hidden p-5 sm:p-6">
              {/* Header: Info customer dan status badge */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3 pb-4 border-b border-cream-200">
                <div>
                  <h3 className="font-display font-bold text-lg text-primary-900">{order.customerName}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-600 mt-1">
                    <p>
                      📱 WA: <a href={`https://wa.me/${order.whatsappNumber.replace(/^0/, '62')}`} target="_blank" rel="noopener noreferrer" className="text-primary-700 font-semibold hover:underline">{order.whatsappNumber}</a>
                    </p>
                    <p>
                      📅 Pengambilan: <span className="font-semibold text-neutral-800">{new Date(order.pickupDate).toLocaleDateString('id-ID')} ({order.pickupTime})</span>
                    </p>
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Dibuat: {new Date(order.createdAt).toLocaleString('id-ID')}
                  </p>
                </div>
                
                {/* Badge status pesanan */}
                <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase ${
                  order.status === 'menunggu' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                  order.status === 'diproses' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                  'bg-green-100 text-green-800 border border-green-200'
                }`}>
                  {order.status}
                </span>
              </div>

              {/* Section detail pesanan */}
              <div className="py-4 border-b border-cream-200">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Item Pesanan:</h4>
                <div className="space-y-1.5">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-xs sm:text-sm">
                      <span className="text-neutral-800">{item.cakeName} <span className="text-neutral-400">× {item.quantity}</span></span>
                      <span className="font-semibold text-primary-900">Rp {(item.cakePrice * item.quantity).toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2.5 mt-2 border-t border-cream-200 font-bold text-sm sm:text-base">
                    <span className="text-primary-900 font-display">Total Tagihan:</span>
                    <span className="text-primary-800 font-sans">Rp {calculateTotal(order.orderItems).toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>

              {/* Section bukti pembayaran dan tombol ubah status */}
              <div className="pt-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-neutral-600">Bukti Transfer:</span>
                  <button
                    onClick={() => setSelectedImage(order.paymentProofUrl)}
                    className="relative h-14 w-14 rounded-lg overflow-hidden border border-cream-300 hover:border-primary-500 transition group"
                  >
                    <Image
                      src={order.paymentProofUrl}
                      alt="Bukti Pembayaran"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </button>
                  <a
                    href={`https://wa.me/${order.whatsappNumber.replace(/^0/, '62')}?text=${encodeURIComponent(
                      `Halo Kak ${order.customerName}, kami dari Toko Kue UMKM ingin mengonfirmasi pesanan #${order.id.slice(-6).toUpperCase()} dengan status saat ini: [${order.status.toUpperCase()}]. Total: Rp ${calculateTotal(order.orderItems).toLocaleString('id-ID')}. Terima kasih!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-semibold transition"
                  >
                    <span>💬 Hubungi Pembeli</span>
                  </a>
                </div>

                {/* Tombol status */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs font-semibold text-neutral-500 hidden sm:inline">Ubah:</span>
                  <button
                    onClick={() => handleStatusChange(order.id, "menunggu")}
                    disabled={order.status === "menunggu"}
                    className="flex-1 sm:flex-none px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold rounded-lg border border-amber-200 transition disabled:opacity-40"
                  >
                    Menunggu
                  </button>
                  <button
                    onClick={() => handleStatusChange(order.id, "diproses")}
                    disabled={order.status === "diproses"}
                    className="flex-1 sm:flex-none px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-semibold rounded-lg border border-blue-200 transition disabled:opacity-40"
                  >
                    Diproses
                  </button>
                  <button
                    onClick={() => handleStatusChange(order.id, "selesai")}
                    disabled={order.status === "selesai"}
                    className="flex-1 sm:flex-none px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-800 text-xs font-semibold rounded-lg border border-green-200 transition disabled:opacity-40"
                  >
                    Selesai
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal untuk preview gambar bukti pembayaran fullscreen */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-2xl max-h-[90vh] w-full p-2 bg-white rounded-xl shadow-2xl">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary-800 text-cream-50 flex items-center justify-center text-sm font-bold shadow-md hover:bg-primary-900"
            >
              ✕
            </button>
            <img
              src={selectedImage}
              alt="Bukti Pembayaran"
              className="max-w-full max-h-[80vh] mx-auto object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
