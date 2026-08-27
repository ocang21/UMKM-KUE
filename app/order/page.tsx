// Directive untuk menandakan bahwa ini adalah Client Component di Next.js
// Client Component dapat menggunakan hooks dan event handlers
'use client';

// Import React hooks untuk state management dan side effects
import { useState, useEffect, Suspense } from "react";
// Import Next.js navigation hooks untuk membaca URL params dan routing
import { useSearchParams, useRouter } from "next/navigation";
// Import komponen SharedImage untuk menampilkan gambar kue
import SharedImage from "@/components/SharedImage";
// Import komponen Link dari Next.js untuk navigasi client-side
import Link from "next/link";
// Import toast untuk menampilkan notifikasi ke user
import toast from "react-hot-toast";
import { SAMPLE_20_CAKES } from "@/lib/sampleCakes";

// Interface untuk tipe data Cake (Kue)
// Mendefinisikan struktur data kue yang akan ditampilkan
interface Cake {
  id: string;           // ID unik kue
  name: string;         // Nama kue
  price: number;        // Harga kue dalam rupiah
  imageUrl: string;     // URL gambar kue
}

// Interface untuk tipe data PaymentAccount (Akun Pembayaran)
// Mendefinisikan struktur data rekening bank untuk pembayaran
interface PaymentAccount {
  id: string;              // ID unik akun pembayaran
  bankName: string;        // Nama bank (contoh: BCA, Mandiri)
  accountNumber: string;   // Nomor rekening
  accountName: string;     // Nama pemilik rekening
}

// Interface untuk tipe data CartItem (Item Keranjang)
// Mendefinisikan struktur item yang ada di keranjang pesanan
interface CartItem {
  cake: Cake;        // Data kue yang dipesan
  quantity: number;  // Jumlah kue yang dipesan
}

const DEFAULT_PAYMENT: PaymentAccount = {
  id: "default-rek",
  bankName: "BCA (Bank Central Asia)",
  accountNumber: "8415-0921-3321",
  accountName: "Toko Kue UMKM Official",
};

// Komponen utama untuk halaman order
// Menangani seluruh logika pemesanan kue
function OrderContent() {
  // Hook untuk membaca query parameters dari URL
  const searchParams = useSearchParams();
  // Hook untuk navigasi programmatic (redirect)
  const router = useRouter();
  // Mengambil cakeId dari URL query parameter jika ada
  const cakeId = searchParams.get("cakeId");

  // State untuk menyimpan daftar semua kue yang tersedia
  const [cakes, setCakes] = useState<Cake[]>(SAMPLE_20_CAKES);
  // State untuk menyimpan informasi akun pembayaran (rekening bank)
  const [paymentAccount, setPaymentAccount] = useState<PaymentAccount | null>(DEFAULT_PAYMENT);
  // State untuk menyimpan nomor WA penjual
  const [sellerWhatsapp, setSellerWhatsapp] = useState<string>("081234567890");
  // State untuk modal sukses dengan tombol WhatsApp
  const [successOrder, setSuccessOrder] = useState<{
    orderId: string;
    customerName: string;
    pickupDate: string;
    pickupTime: string;
    total: number;
    itemsSummary: string;
    waUrl: string;
  } | null>(null);
  // State untuk menyimpan item-item di keranjang pesanan
  const [cart, setCart] = useState<CartItem[]>([]);
  // State untuk menyimpan data form pemesanan (nama, nomor WA, tanggal & jam ambil)
  const [formData, setFormData] = useState({
    customerName: "",      // Nama lengkap pembeli
    whatsappNumber: "",    // Nomor WhatsApp pembeli
    pickupDate: "",        // Tanggal pengambilan pesanan
    pickupTime: "",        // Jam pengambilan pesanan
  });
  // State untuk menyimpan file bukti pembayaran yang di-upload
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  // State untuk menyimpan preview gambar bukti pembayaran
  const [paymentProofPreview, setPaymentProofPreview] = useState<string>("");
  // State untuk tracking loading state saat submit form
  const [isLoading, setIsLoading] = useState(false);

  // useEffect pertama: Dijalankan sekali saat komponen pertama kali dimuat
  // Memanggil fetchData untuk mengambil data kue dan akun pembayaran dari API
  useEffect(() => {
    fetchData();
  }, []); // Dependency array kosong = hanya run sekali saat mount

  // useEffect kedua: Dijalankan ketika cakeId atau daftar cakes berubah
  // Jika ada cakeId di URL, otomatis tambahkan kue tersebut ke keranjang
  useEffect(() => {
    // Pastikan cakeId ada dan daftar cakes sudah dimuat
    if (cakeId && cakes.length > 0) {
      // Cari kue berdasarkan cakeId dari URL
      const cake = cakes.find(c => c.id === cakeId);
      // Jika kue ditemukan dan belum ada di cart, tambahkan ke cart dengan quantity 1
      if (cake && !cart.some(item => item.cake.id === cakeId)) {
        setCart([{ cake, quantity: 1 }]);
      }
    }
  }, [cakeId, cakes]); // Dependency: cakeId dan cakes

  // Fungsi untuk mengambil data dari API
  // Mengambil daftar kue yang tersedia dan informasi akun pembayaran
  const fetchData = async () => {
    try {
      const [cakesRes, paymentRes, settingsRes] = await Promise.all([
        fetch("/api/cakes/available"),
        fetch("/api/payment-accounts/public"),
        fetch("/api/settings")
      ]);

      if (cakesRes.ok) {
        const cakesData = await cakesRes.json();
        if (Array.isArray(cakesData) && cakesData.length > 0) {
          setCakes(cakesData);
        }
      }

      if (paymentRes.ok) {
        const paymentData = await paymentRes.json();
        if (paymentData && !paymentData.error && paymentData.bankName) {
          setPaymentAccount(paymentData);
        }
      }

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        if (settingsData && settingsData.whatsappNumber) {
          setSellerWhatsapp(settingsData.whatsappNumber);
        }
      }
    } catch (error) {
      console.log("Using default bakery catalogue for ordering");
    }
  };

  // Fungsi untuk menambahkan kue ke keranjang
  // Parameter: cake - objek kue yang akan ditambahkan
  const addToCart = (cake: Cake) => {
    // Cek apakah kue sudah ada di keranjang
    const existing = cart.find(item => item.cake.id === cake.id);
    
    if (existing) {
      // Jika sudah ada, tambahkan quantity-nya saja
      setCart(cart.map(item =>
        item.cake.id === cake.id
          ? { ...item, quantity: item.quantity + 1 } // Increment quantity
          : item // Item lain tetap tidak berubah
      ));
    } else {
      // Jika belum ada, tambahkan item baru ke cart dengan quantity 1
      setCart([...cart, { cake, quantity: 1 }]);
    }
    // Tampilkan notifikasi sukses ke user
    toast.success(`${cake.name} ditambahkan ke pesanan`);
  };

  // Fungsi untuk mengupdate jumlah (quantity) kue di keranjang
  // Parameter: cakeId - ID kue yang akan diupdate, quantity - jumlah baru
  const updateQuantity = (cakeId: string, quantity: number) => {
    // Jika quantity kurang dari 1, hapus item dari cart
    if (quantity < 1) {
      removeFromCart(cakeId);
      return;
    }
    // Update quantity item yang sesuai dengan cakeId
    setCart(cart.map(item =>
      item.cake.id === cakeId ? { ...item, quantity } : item
    ));
  };

  // Fungsi untuk menghapus item dari keranjang
  // Parameter: cakeId - ID kue yang akan dihapus
  const removeFromCart = (cakeId: string) => {
    // Filter cart, hapus item yang memiliki cakeId yang sama
    setCart(cart.filter(item => item.cake.id !== cakeId));
  };

  // Fungsi untuk menghitung total harga pesanan
  // Menjumlahkan (harga x quantity) semua item di keranjang
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.cake.price * item.quantity), 0);
  };

  // Fungsi untuk menangani perubahan file bukti pembayaran
  // Dipanggil ketika user memilih file gambar bukti transfer
  const handlePaymentProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Ambil file pertama yang dipilih user
    const file = e.target.files?.[0];
    if (file) {
      // Simpan file ke state
      setPaymentProof(file);
      // Buat FileReader untuk membaca file dan menampilkan preview
      const reader = new FileReader();
      // Callback ketika file selesai dibaca
      reader.onloadend = () => {
        // Simpan hasil reading (base64) untuk preview gambar
        setPaymentProofPreview(reader.result as string);
      };
      // Baca file sebagai Data URL (base64)
      reader.readAsDataURL(file);
    }
  };

  // Fungsi untuk menangani submit form pemesanan
  // Mengirim data pesanan ke API
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent default form submission behavior (page refresh)
    e.preventDefault();

    // Validasi: Cek apakah keranjang kosong
    if (cart.length === 0) {
      toast.error("Keranjang pesanan masih kosong");
      return; // Stop execution jika validasi gagal
    }

    // Validasi: Cek apakah bukti pembayaran sudah di-upload
    if (!paymentProof) {
      toast.error("Bukti pembayaran wajib diunggah");
      return; // Stop execution jika validasi gagal
    }

    // Set loading state menjadi true untuk disable button dan tampilkan loading
    setIsLoading(true);

    try {
      // Buat FormData object untuk mengirim file dan data lainnya
      const formDataToSend = new FormData();
      // Append semua data form ke FormData
      formDataToSend.append("customerName", formData.customerName);
      formDataToSend.append("whatsappNumber", formData.whatsappNumber);
      formDataToSend.append("pickupDate", formData.pickupDate);
      formDataToSend.append("pickupTime", formData.pickupTime);
      formDataToSend.append("paymentProof", paymentProof); // Append file bukti bayar

      // Transform cart items menjadi format yang dibutuhkan API
      const orderItems = cart.map(item => ({
        cakeId: item.cake.id,      // ID kue
        quantity: item.quantity,    // Jumlah
        cakeName: item.cake.name,   // Nama kue (untuk record)
        cakePrice: item.cake.price, // Harga kue (untuk record)
      }));

      // Append orderItems sebagai JSON string
      formDataToSend.append("orderItems", JSON.stringify(orderItems));

      // Kirim POST request ke API orders
      const res = await fetch("/api/orders", {
        method: "POST",
        body: formDataToSend, // Body berisi FormData dengan file
      });

      // Cek apakah response tidak OK (status code bukan 2xx)
      if (!res.ok) {
        const data = await res.json();
        // Throw error dengan message dari API atau default message
        throw new Error(data.error || "Gagal membuat pesanan");
      }

      const createdOrder = await res.json();
      const grandTotal = calculateTotal();

      // Format teks item pesanan untuk WhatsApp
      const itemsListText = cart
        .map((item, idx) => `${idx + 1}. ${item.cake.name} (${item.quantity}x) = Rp ${(item.cake.price * item.quantity).toLocaleString("id-ID")}`)
        .join("\n");

      // Format template pesan WhatsApp untuk penjual
      const waMessage =
`Halo Admin Toko Kue, saya telah melakukan pemesanan dan pembayaran via website:

📋 *DETAIL PESANAN*
• *No. Order:* #${createdOrder.id ? createdOrder.id.slice(-6).toUpperCase() : "BARU"}
• *Nama Pembeli:* ${formData.customerName}
• *Nomor WA Pembeli:* ${formData.whatsappNumber}
• *Jadwal Pengambilan:* ${new Date(formData.pickupDate).toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} - Pukul ${formData.pickupTime} WIB

🍰 *RINCIAN KUE:*
${itemsListText}

💰 *TOTAL TAGIHAN:* Rp ${grandTotal.toLocaleString("id-ID")}
💳 *Metode:* Transfer ${paymentAccount?.bankName || "Bank"}

Bukti pembayaran telah saya upload di website. Mohon dicek dan dikonfirmasi. Terima kasih!`;

      // Bersihkan nomor WhatsApp penjual (misal 0812 -> 62812)
      let cleanSellerPhone = sellerWhatsapp.replace(/\D/g, "");
      if (cleanSellerPhone.startsWith("0")) {
        cleanSellerPhone = "62" + cleanSellerPhone.slice(1);
      }
      if (!cleanSellerPhone) cleanSellerPhone = "6281234567890";

      const waDirectUrl = `https://api.whatsapp.com/send?phone=${cleanSellerPhone}&text=${encodeURIComponent(waMessage)}`;

      // Tampilkan popup sukses dan tombol kirim notifikasi WA langsung
      setSuccessOrder({
        orderId: createdOrder.id || "BARU",
        customerName: formData.customerName,
        pickupDate: formData.pickupDate,
        pickupTime: formData.pickupTime,
        total: grandTotal,
        itemsSummary: itemsListText,
        waUrl: waDirectUrl,
      });

      // Buka tab WhatsApp secara otomatis jika memungkinkan
      try {
        window.open(waDirectUrl, "_blank", "noopener,noreferrer");
      } catch (e) {
        console.log("Auto-open WA blocked, fallback to button");
      }

      toast.success("Pesanan berhasil disimpan di database!");

      // Reset form ke kondisi awal
      setCart([]);
      setFormData({
        customerName: "",
        whatsappNumber: "",
        pickupDate: "",
        pickupTime: "",
      });
      setPaymentProof(null);
      setPaymentProofPreview("");

    } catch (error: any) {
      // Tangani error dan tampilkan notifikasi error
      toast.error(error.message);
    } finally {
      // Set loading state menjadi false, baik sukses maupun error
      setIsLoading(false);
    }
  };

  // Menghitung tanggal minimum untuk pickup (besok)
  // User tidak bisa memilih hari ini, minimal besok
  const tomorrow = new Date(); // Buat object date hari ini
  tomorrow.setDate(tomorrow.getDate() + 1); // Tambah 1 hari
  const minDate = tomorrow.toISOString().split('T')[0]; // Format ke YYYY-MM-DD

  // Return JSX - Tampilan UI halaman order
  return (
    <div className="min-h-screen bg-cream-50 py-8 px-4 selection:bg-accent-gold selection:text-white">
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-200 pb-6">
          <div className="flex items-start gap-3.5">
            <Link href="/" className="w-12 h-12 rounded-full overflow-hidden border-2 border-accent-gold shadow-warm-sm flex-shrink-0 bg-cream-100 hidden sm:block">
              <img
                src="/logo.jpeg"
                alt="Logo Toko Kue UMKM"
                className="w-full h-full object-cover"
              />
            </Link>
            <div>
              <Link 
                href="/" 
                className="text-xs font-semibold uppercase tracking-widest text-accent-amber hover:text-primary-800 transition inline-flex items-center gap-1.5 mb-1"
              >
                <span>←</span>
                <span>Kembali ke Beranda</span>
              </Link>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-primary-900 tracking-tight">
                Formulir Pemesanan Kue
              </h1>
              <p className="text-neutral-600 text-sm mt-0.5">
                Pilih kue favorit Anda dan tentukan jadwal pengambilan yang nyaman.
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-cream-100 rounded-full border border-cream-300 text-xs font-semibold uppercase tracking-wider text-primary-800">
            <span>✨ Fresh from the Oven</span>
          </div>
        </div>

        {/* Grid Layout: 1 kolom di mobile, 3 kolom di desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Kolom Kiri - Daftar Kue yang Tersedia */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-white rounded-xl border border-cream-300 shadow-warm-sm p-5 lg:sticky lg:top-20">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-cream-200">
                <h2 className="text-lg font-display font-bold text-primary-900">
                  Pilih Menu Kue
                </h2>
                <span className="text-[11px] font-semibold text-accent-amber uppercase tracking-wider">
                  {cakes.length} Pilihan
                </span>
              </div>
              
              <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
                {cakes.length === 0 ? (
                  <p className="text-center py-8 text-neutral-500 text-xs">Tidak ada menu yang tersedia saat ini.</p>
                ) : (
                  cakes.map((cake) => (
                    <div
                      key={cake.id}
                      onClick={() => addToCart(cake)}
                      className="group flex items-center gap-3.5 p-3 rounded-lg border border-cream-200 hover:border-primary-500 hover:bg-cream-50 transition cursor-pointer"
                    >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-cream-100 border border-cream-200">
                        <SharedImage
                          src={cake.imageUrl}
                          alt={cake.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-semibold text-primary-900 text-sm truncate group-hover:text-primary-700">
                          {cake.name}
                        </h3>
                        <p className="text-primary-700 font-bold text-sm mt-0.5">
                          Rp {cake.price.toLocaleString("id-ID")}
                        </p>
                      </div>
                      <button 
                        type="button"
                        aria-label="Tambah kue"
                        className="w-8 h-8 rounded-full bg-cream-100 group-hover:bg-primary-800 text-primary-800 group-hover:text-cream-50 font-bold text-base flex items-center justify-center transition-colors flex-shrink-0"
                      >
                        +
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Kolom Kanan - Form Order */}
          <div className="lg:col-span-7 xl:col-span-8">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-cream-300 shadow-warm-md p-6 sm:p-8 space-y-8">
              {/* Section 1: Keranjang Pesanan */}
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-cream-200">
                  <h2 className="text-xl font-display font-bold text-primary-900">
                    1. Keranjang Pesanan
                  </h2>
                  <span className="text-xs text-neutral-500">
                    {cart.reduce((sum, i) => sum + i.quantity, 0)} item
                  </span>
                </div>

                {cart.length === 0 ? (
                  <div className="bg-cream-50 rounded-xl border border-dashed border-cream-300 p-8 text-center">
                    <p className="text-neutral-600 text-sm font-medium">Keranjang pesanan Anda masih kosong.</p>
                    <p className="text-neutral-400 text-xs mt-1">Klik tanda (+) pada menu di samping untuk menambahkan.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.cake.id} className="flex items-center gap-3.5 p-3.5 rounded-lg border border-cream-200 bg-cream-50/50">
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-cream-100 border border-cream-200">
                          <SharedImage
                            src={item.cake.imageUrl}
                            alt={item.cake.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display font-semibold text-primary-900 text-sm truncate">{item.cake.name}</h3>
                          <p className="text-primary-700 font-bold text-xs mt-0.5">
                            Rp {item.cake.price.toLocaleString("id-ID")}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0 bg-white border border-cream-300 rounded-full p-1">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cake.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-full bg-cream-100 hover:bg-cream-200 text-primary-800 font-bold text-sm flex items-center justify-center transition"
                          >
                            -
                          </button>
                          <span className="w-6 text-center font-bold text-xs text-primary-900">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cake.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-full bg-primary-800 hover:bg-primary-900 text-cream-50 font-bold text-sm flex items-center justify-center transition"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.cake.id)}
                          aria-label="Hapus item"
                          className="p-2 text-neutral-400 hover:text-red-600 transition text-sm flex-shrink-0"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <div className="flex justify-between items-center p-4 bg-cream-100 rounded-xl border border-cream-300 font-bold">
                      <span className="text-primary-900 text-sm font-display">Total Pesanan:</span>
                      <span className="text-primary-800 text-xl font-display">
                        Rp {calculateTotal().toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 2: Data Pembeli */}
              <div>
                <div className="mb-4 pb-2 border-b border-cream-200">
                  <h2 className="text-xl font-display font-bold text-primary-900">
                    2. Data Pengambilan
                  </h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-lg border border-cream-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition bg-cream-50/40"
                      placeholder="Masukkan nama pemesan"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                      Nomor WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.whatsappNumber}
                      onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-lg border border-cream-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition bg-cream-50/40"
                      placeholder="Contoh: 081234567890"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                        Tanggal Ambil *
                      </label>
                      <input
                        type="date"
                        required
                        min={minDate}
                        value={formData.pickupDate}
                        onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                        className="w-full px-4 py-2.5 text-sm rounded-lg border border-cream-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition bg-cream-50/40"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                        Jam Ambil *
                      </label>
                      <input
                        type="time"
                        required
                        value={formData.pickupTime}
                        onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
                        className="w-full px-4 py-2.5 text-sm rounded-lg border border-cream-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition bg-cream-50/40"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Pembayaran */}
              <div>
                <div className="mb-4 pb-2 border-b border-cream-200">
                  <h2 className="text-xl font-display font-bold text-primary-900">
                    3. Pembayaran & Konfirmasi
                  </h2>
                </div>
                
                {paymentAccount ? (
                  <div className="vintage-frame bg-cream-50 rounded-xl mb-5 text-left">
                    <div className="text-xs uppercase tracking-widest text-accent-amber font-semibold mb-2">
                      Rekening Resmi Toko
                    </div>
                    <div className="space-y-1">
                      <p className="font-display font-bold text-lg text-primary-900">{paymentAccount.bankName}</p>
                      <p className="font-mono text-2xl font-bold text-primary-700 tracking-wider break-all">
                        {paymentAccount.accountNumber}
                      </p>
                      <p className="text-xs text-neutral-600">
                        Atas Nama: <span className="font-semibold text-neutral-800">{paymentAccount.accountName}</span>
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-cream-300 flex justify-between items-center text-xs">
                      <span className="text-neutral-600">Jumlah Transfer:</span>
                      <span className="font-bold text-primary-900 font-sans text-sm">
                        Rp {calculateTotal().toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 text-xs text-amber-800">
                    Informasi rekening pembayaran sedang tidak tersedia.
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Unggah Bukti Transfer / Pembayaran *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={handlePaymentProofChange}
                    className="w-full px-4 py-2.5 text-xs rounded-lg border border-cream-300 focus:ring-2 focus:ring-primary-500 bg-cream-50/30 file:mr-4 file:py-1.5 file:px-3.5 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary-800 file:text-cream-50 hover:file:bg-primary-900 file:cursor-pointer"
                  />
                  {paymentProofPreview && (
                    <div className="mt-4 p-2 bg-cream-100 rounded-xl border border-cream-300 max-w-sm">
                      <p className="text-[11px] font-semibold text-neutral-600 mb-2 uppercase tracking-wider">Preview Bukti:</p>
                      <img
                        src={paymentProofPreview}
                        alt="Preview Bukti Pembayaran"
                        className="w-full h-44 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading || cart.length === 0 || !paymentAccount}
                  className="w-full btn-primary py-4 text-sm uppercase tracking-wider shadow-warm-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Mengirim Pesanan..." : "Konfirmasi & Kirim Pesanan"}
                </button>
                <p className="text-center text-[11px] text-neutral-500 mt-2.5">
                  Pesanan Anda akan diproses setelah bukti pembayaran diverifikasi oleh pihak kami.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal Popup Sukses Pemesanan + Tombol Notifikasi WhatsApp ke Penjual */}
      {successOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-warm-xl border border-cream-300 space-y-5 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner">
              ✓
            </div>

            <div>
              <span className="text-xs font-semibold text-accent-amber uppercase tracking-widest block mb-1">
                Order #{successOrder.orderId.slice(-6).toUpperCase()} Tersimpan
              </span>
              <h3 className="text-2xl font-display font-bold text-primary-900">
                Pesanan Berhasil Dibuat!
              </h3>
              <p className="text-neutral-600 text-xs sm:text-sm mt-1">
                Data pesanan & bukti pembayaran telah tersimpan aman di database toko.
              </p>
            </div>

            <div className="bg-cream-50 border border-cream-200 rounded-xl p-4 text-left text-xs space-y-1.5 text-neutral-700">
              <p>👤 <strong>Pemesan:</strong> {successOrder.customerName}</p>
              <p>📅 <strong>Ambil:</strong> {new Date(successOrder.pickupDate).toLocaleDateString('id-ID')} ({successOrder.pickupTime})</p>
              <p>💰 <strong>Total:</strong> <span className="font-bold text-primary-900">Rp {successOrder.total.toLocaleString('id-ID')}</span></p>
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs text-left">
              <p className="font-semibold mb-1 flex items-center gap-1.5">
                <span>💬</span> Konfirmasi Cepat ke WhatsApp Penjual:
              </p>
              <p className="text-[11px] text-emerald-700 leading-relaxed">
                Kirim pesan rincian pesanan langsung ke nomor WhatsApp penjual agar pesanan segera disiapkan.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={successOrder.waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl text-xs uppercase tracking-wider shadow-warm-md transition"
              >
                <span>📲 Chat Penjual di WA</span>
              </a>
              <Link
                href="/"
                className="flex-1 inline-flex items-center justify-center py-3 px-4 rounded-xl text-xs font-semibold text-neutral-700 bg-cream-100 hover:bg-cream-200 border border-cream-300 transition"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Komponen utama yang di-export untuk halaman order
// Membungkus OrderContent dengan Suspense untuk loading state
export default function OrderPage() {
  return (
    // Suspense untuk menangani loading state saat komponen sedang dimuat
    // fallback akan ditampilkan saat OrderContent belum selesai loading
    <Suspense fallback={
      // Loading indicator - spinner yang berputar
      <div className="min-h-screen flex items-center justify-center">
        {/* Spinner dengan animasi rotate */}
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    }>
      {/* Render komponen OrderContent setelah loading selesai */}
      <OrderContent />
    </Suspense>
  );
}
