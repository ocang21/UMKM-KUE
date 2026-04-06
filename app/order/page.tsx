// Directive untuk menandakan bahwa ini adalah Client Component di Next.js
// Client Component dapat menggunakan hooks dan event handlers
'use client';

// Import React hooks untuk state management dan side effects
import { useState, useEffect, Suspense } from "react";
// Import Next.js navigation hooks untuk membaca URL params dan routing
import { useSearchParams, useRouter } from "next/navigation";
// Import komponen Image dari Next.js untuk optimasi gambar
import Image from "next/image";
// Import komponen Link dari Next.js untuk navigasi client-side
import Link from "next/link";
// Import toast untuk menampilkan notifikasi ke user
import toast from "react-hot-toast";

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
  const [cakes, setCakes] = useState<Cake[]>([]);
  // State untuk menyimpan informasi akun pembayaran (rekening bank)
  const [paymentAccount, setPaymentAccount] = useState<PaymentAccount | null>(null);
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
      // Fetch data secara parallel menggunakan Promise.all untuk efisiensi
      const [cakesRes, paymentRes] = await Promise.all([
        fetch("/api/cakes/available"),      // API endpoint untuk kue yang tersedia
        fetch("/api/payment-accounts/public") // API endpoint untuk akun pembayaran publik
      ]);

      // Parse response JSON dari kedua API
      const cakesData = await cakesRes.json();
      const paymentData = await paymentRes.json();

      // Set state dengan data yang sudah di-fetch
      setCakes(cakesData);
      
      // Pastikan paymentData adalah objek valid, bukan array atau error
      if (paymentData && !paymentData.error) {
        setPaymentAccount(paymentData);
      } else {
        // Jika ada error atau data tidak valid, set null
        setPaymentAccount(null);
      }
    } catch (error) {
      // Tangani error jika fetch gagal (network error, dll)
      console.error("Error fetching data:", error);
      toast.error("Gagal memuat data"); // Tampilkan notifikasi error ke user
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

      // Jika sukses, tampilkan notifikasi sukses
      toast.success("Pesanan berhasil dibuat! Terima kasih 🎉");
      
      // Reset form ke kondisi awal setelah pesanan berhasil
      setCart([]); // Kosongkan keranjang
      setFormData({
        customerName: "",
        whatsappNumber: "",
        pickupDate: "",
        pickupTime: "",
      });
      setPaymentProof(null); // Hapus file bukti pembayaran
      setPaymentProofPreview(""); // Hapus preview gambar

      // Redirect ke halaman home setelah 2 detik
      setTimeout(() => {
        router.push("/");
      }, 2000);

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
    // Container utama dengan background neutral dan padding
    <div className="min-h-screen bg-neutral-50 py-6 px-4">
      {/* Container dengan max width dan centered */}
      <div className="container mx-auto max-w-7xl">
        {/* Header Section - Tombol kembali dan judul */}
        <div className="mb-6">
          {/* Link untuk kembali ke homepage */}
          <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium text-sm inline-flex items-center">
            ← Kembali ke Beranda
          </Link>
          {/* Judul halaman */}
          <h1 className="text-3xl font-display font-bold text-neutral-900 mt-3">
            Pesan Kue
          </h1>
        </div>

        {/* Grid Layout: 1 kolom di mobile, 3 kolom di desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Kolom Kiri - Daftar Kue yang Tersedia */}
          <div className="lg:col-span-1">
            {/* Card dengan sticky positioning agar tetap terlihat saat scroll */}
            <div className="card-natural p-5 lg:sticky lg:top-4">
              {/* Judul section */}
              <h2 className="text-xl font-display font-bold text-neutral-800 mb-4">
                Pilih Kue
              </h2>
              {/* Container daftar kue dengan scroll jika konten terlalu panjang */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {/* Loop semua kue yang tersedia */}
                {cakes.map((cake) => (
                  // Card untuk setiap kue, clickable untuk add to cart
                  <div
                    key={cake.id}
                    className="flex items-center gap-3 p-3 border border-neutral-200 rounded-natural hover:border-primary-500 transition cursor-pointer"
                    onClick={() => addToCart(cake)} // Tambahkan kue ke cart saat diklik
                  >
                    {/* Gambar kue */}
                    <div className="relative w-16 h-16 rounded-natural overflow-hidden flex-shrink-0">
                      <Image
                        src={cake.imageUrl}
                        alt={cake.name}
                        fill // Fill parent container
                        className="object-cover" // Cover tanpa distorsi
                      />
                    </div>
                    {/* Info kue: nama dan harga */}
                    <div className="flex-1 min-w-0">
                      {/* Nama kue dengan truncate jika terlalu panjang */}
                      <h3 className="font-semibold text-neutral-800 text-sm truncate">{cake.name}</h3>
                      {/* Harga kue dengan format Indonesia (dengan titik pemisah ribuan) */}
                      <p className="text-primary-600 font-bold text-sm">
                        Rp {cake.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                    {/* Tombol + untuk menambah ke cart */}
                    <button className="text-primary-500 hover:text-primary-600 text-2xl flex-shrink-0 w-8">
                      +
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Kolom Kanan - Form Order (span 2 kolom di desktop) */}
          <div className="lg:col-span-2">
            {/* Form dengan onSubmit handler */}
            <form onSubmit={handleSubmit} className="card-natural p-5 space-y-5">
              {/* Section 1: Keranjang Pesanan */}
              <div>
                {/* Judul section */}
                <h2 className="text-xl font-display font-bold text-neutral-800 mb-4">
                  Keranjang Pesanan
                </h2>
                {/* Conditional rendering: tampilkan pesan jika cart kosong */}
                {cart.length === 0 ? (
                  <div className="bg-neutral-100 rounded-natural p-8 text-center">
                    <p className="text-neutral-600 text-sm">Belum ada kue dipilih</p>
                  </div>
                ) : (
                  // Jika ada item di cart, tampilkan daftar item
                  <div className="space-y-3">
                    {/* Loop semua item di cart */}
                    {cart.map((item) => (
                      // Card untuk setiap item
                      <div key={item.cake.id} className="flex items-center gap-3 p-3 border border-neutral-200 rounded-natural">
                        {/* Gambar kue */}
                        <div className="relative w-16 h-16 rounded-natural overflow-hidden flex-shrink-0">
                          <Image
                            src={item.cake.imageUrl}
                            alt={item.cake.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        {/* Info kue */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-neutral-800 text-sm truncate">{item.cake.name}</h3>
                          <p className="text-primary-600 font-bold text-sm">
                            Rp {item.cake.price.toLocaleString("id-ID")}
                          </p>
                        </div>
                        {/* Quantity control: tombol -, jumlah, tombol + */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {/* Tombol kurangi quantity */}
                          <button
                            type="button" // Prevent form submission
                            onClick={() => updateQuantity(item.cake.id, item.quantity - 1)}
                            className="w-8 h-8 bg-neutral-200 hover:bg-neutral-300 rounded-natural font-bold"
                          >
                            -
                          </button>
                          {/* Display jumlah quantity */}
                          <span className="w-8 text-center font-bold">{item.quantity}</span>
                          {/* Tombol tambah quantity */}
                          <button
                            type="button" // Prevent form submission
                            onClick={() => updateQuantity(item.cake.id, item.quantity + 1)}
                            className="w-8 h-8 bg-primary-500 hover:bg-primary-600 text-white rounded-natural font-bold"
                          >
                            +
                          </button>
                        </div>
                        {/* Tombol hapus item dari cart */}
                        <button
                          type="button" // Prevent form submission
                          onClick={() => removeFromCart(item.cake.id)}
                          className="text-red-500 hover:text-red-600 text-xl flex-shrink-0"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                    {/* Total harga seluruh item di cart */}
                    <div className="flex justify-between items-center pt-4 border-t border-neutral-200 text-lg font-bold">
                      <span>Total:</span>
                      {/* Tampilkan total dengan format rupiah */}
                      <span className="text-primary-600">
                        Rp {calculateTotal().toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 2: Data Pembeli */}
              <div className="border-t border-neutral-200 pt-5">
                {/* Judul section */}
                <h2 className="text-xl font-display font-bold text-neutral-800 mb-4">
                  Data Pembeli
                </h2>
                {/* Container untuk form fields */}
                <div className="space-y-4">
                  {/* Input Nama Lengkap */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      required // Field wajib diisi
                      value={formData.customerName} // Controlled input
                      // Update state saat user mengetik
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-natural border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>

                  {/* Input Nomor WhatsApp */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Nomor WhatsApp *
                    </label>
                    <input
                      type="tel" // Type tel untuk input nomor telepon
                      required // Field wajib diisi
                      value={formData.whatsappNumber} // Controlled input
                      // Update state saat user mengetik
                      onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-natural border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Contoh: 081234567890"
                    />
                  </div>

                  {/* Grid untuk Tanggal dan Jam Ambil */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Input Tanggal Ambil */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Tanggal Ambil *
                      </label>
                      <input
                        type="date" // Date picker
                        required // Field wajib diisi
                        min={minDate} // Minimum tanggal adalah besok (tidak bisa hari ini)
                        value={formData.pickupDate} // Controlled input
                        // Update state saat user memilih tanggal
                        onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                        className="w-full px-4 py-2.5 text-sm rounded-natural border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    {/* Input Jam Ambil */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Jam Ambil *
                      </label>
                      <input
                        type="time" // Time picker
                        required // Field wajib diisi
                        value={formData.pickupTime} // Controlled input
                        // Update state saat user memilih jam
                        onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
                        className="w-full px-4 py-2.5 text-sm rounded-natural border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Pembayaran */}
              <div className="border-t border-neutral-200 pt-5">
                {/* Judul section */}
                <h2 className="text-xl font-display font-bold text-neutral-800 mb-4">
                  Pembayaran
                </h2>
                
                {/* Conditional rendering: tampilkan info rekening jika ada */}
                {paymentAccount ? (
                  // Jika ada data rekening, tampilkan informasi rekening
                  <div className="bg-accent-cream rounded-natural p-5 mb-4">
                    <p className="text-sm text-neutral-600 mb-3">Transfer ke rekening berikut:</p>
                    {/* Info rekening bank */}
                    <div className="space-y-2">
                      {/* Nama Bank */}
                      <p className="font-bold text-lg">{paymentAccount.bankName}</p>
                      {/* Nomor Rekening dengan font monospace agar mudah dibaca */}
                      <p className="font-mono text-xl text-primary-600 break-all">{paymentAccount.accountNumber}</p>
                      {/* Nama Pemilik Rekening */}
                      <p className="text-sm text-neutral-700">a.n. <span className="font-semibold">{paymentAccount.accountName}</span></p>
                    </div>
                    {/* Box highlight untuk total pembayaran */}
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-natural">
                      <p className="text-sm text-yellow-800">
                        Total yang harus dibayar: <span className="font-bold">Rp {calculateTotal().toLocaleString("id-ID")}</span>
                      </p>
                    </div>
                  </div>
                ) : (
                  // Jika tidak ada data rekening, tampilkan error message
                  <div className="bg-red-50 border border-red-200 rounded-natural p-4 mb-4">
                    <p className="text-red-600 text-sm">Informasi rekening belum tersedia</p>
                  </div>
                )}

                {/* Input file untuk upload bukti pembayaran */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Upload Bukti Pembayaran *
                  </label>
                  <input
                    type="file" // Input file
                    accept="image/*" // Hanya terima file gambar
                    required // Field wajib diisi
                    onChange={handlePaymentProofChange} // Handler untuk perubahan file
                    className="w-full px-4 py-2.5 text-sm rounded-natural border border-neutral-300 focus:ring-2 focus:ring-primary-500"
                  />
                  {/* Conditional rendering: tampilkan preview jika ada gambar yang dipilih */}
                  {paymentProofPreview && (
                    <div className="mt-3">
                      {/* Preview gambar bukti pembayaran */}
                      <img
                        src={paymentProofPreview} // Data URL dari FileReader
                        alt="Preview"
                        className="w-full max-w-md h-48 object-cover rounded-natural"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Tombol Submit - Kirim Pesanan */}
              <button
                type="submit" // Submit form
                // Disable button jika: sedang loading, cart kosong, atau tidak ada info rekening
                disabled={isLoading || cart.length === 0 || !paymentAccount}
                className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed text-base"
              >
                {/* Text berubah saat loading */}
                {isLoading ? "Mengirim Pesanan..." : "Kirim Pesanan"}
              </button>
            </form>
          </div>
        </div>
      </div>
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
