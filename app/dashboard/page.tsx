// Import getServerSession untuk cek session di server component
import { getServerSession } from "next-auth";
// Import authOptions untuk konfigurasi NextAuth
import { authOptions } from "@/lib/auth";
// Import Prisma client untuk query database
import { prisma } from "@/lib/prisma";
// Import Link untuk navigasi client-side
import Link from "next/link";

// Halaman utama dashboard - Menampilkan overview dan statistik bisnis
// Server Component: Fetch data langsung di server untuk performance
export default async function DashboardPage() {
  // Ambil session untuk mendapatkan user info
  const session = await getServerSession(authOptions);
  
  // Fetch statistik dashboard secara parallel menggunakan Promise.all untuk efisiensi
  // Semua query dijalankan bersamaan, bukan sequential
  const [totalCakes, totalOrders, pendingOrders, totalRevenue] = await Promise.all([
    // Query 1: Hitung total kue milik user yang sedang login
    prisma.cake.count({ where: { userId: session?.user.id } }),
    // Query 2: Hitung total semua pesanan
    prisma.order.count(),
    // Query 3: Hitung pesanan yang masih menunggu (status pending)
    prisma.order.count({ where: { status: "menunggu" } }),
    // Query 4: Hitung total revenue dari pesanan yang sudah selesai
    prisma.order.findMany({
      where: { status: "selesai" }, // Hanya pesanan selesai
      include: { orderItems: true } // Include items untuk hitung total
    }).then((orders: any) => 
      // Reduce untuk menjumlahkan semua harga dari semua order items
      orders.reduce((total: number, order: any) => 
        total + order.orderItems.reduce((sum: number, item: any) => 
          sum + (item.cakePrice * item.quantity), 0 // Harga x quantity
        ), 0
      )
    ),
  ]);

  // Fetch 5 pesanan terbaru untuk ditampilkan di dashboard
  const recentOrders = await prisma.order.findMany({
    take: 5,                          // Ambil 5 data teratas
    orderBy: { createdAt: 'desc' },   // Urutkan dari yang terbaru
    include: { orderItems: true }     // Include order items untuk info detail
  });

  // Return JSX - Tampilan UI dashboard
  return (
    // Container dengan max width
    <div className="max-w-7xl mx-auto">
      {/* Welcome Header - Sambutan user */}
      <div className="mb-6">
        {/* Judul dengan nama user dari session */}
        <h1 className="text-3xl font-display font-bold text-neutral-900 mb-1">
          Selamat Datang, {session?.user.name}!
        </h1>
        {/* Subtitle */}
        <p className="text-neutral-600">Berikut ringkasan bisnis Anda hari ini</p>
      </div>

      {/* Statistics Cards - Grid cards menampilkan metrics penting */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Card 1: Total Menu Kue */}
        <div className="card-natural p-5">
          {/* Header card dengan angka dan icon */}
          <div className="flex justify-between items-start mb-3">
            <div>
              {/* Label metric */}
              <p className="text-neutral-500 text-sm font-medium">Total Menu</p>
              {/* Angka metric - total kue */}
              <h3 className="text-2xl font-bold mt-1 text-neutral-900">{totalCakes}</h3>
            </div>
            {/* Icon dengan background warna */}
            <div className="bg-blue-50 p-2 rounded-natural">
              <span className="text-2xl">🍰</span>
            </div>
          </div>
          {/* Deskripsi metric */}
          <p className="text-neutral-600 text-xs">Menu kue aktif</p>
        </div>

        {/* Card 2: Total Pesanan */}
        <div className="card-natural p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-neutral-500 text-sm font-medium">Total Pesanan</p>
              {/* Angka total semua pesanan */}
              <h3 className="text-2xl font-bold mt-1 text-neutral-900">{totalOrders}</h3>
            </div>
            <div className="bg-green-50 p-2 rounded-natural">
              <span className="text-2xl">📦</span>
            </div>
          </div>
          <p className="text-neutral-600 text-xs">Semua waktu</p>
        </div>

        {/* Card 3: Pesanan Menunggu (Pending) */}
        <div className="card-natural p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-neutral-500 text-sm font-medium">Menunggu</p>
              {/* Angka pesanan yang masih pending */}
              <h3 className="text-2xl font-bold mt-1 text-neutral-900">{pendingOrders}</h3>
            </div>
            <div className="bg-yellow-50 p-2 rounded-natural">
              <span className="text-2xl">⏳</span>
            </div>
          </div>
          <p className="text-neutral-600 text-xs">Pesanan pending</p>
        </div>

        {/* Card 4: Total Pendapatan (Revenue) */}
        <div className="card-natural p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-neutral-500 text-sm font-medium">Pendapatan</p>
              {/* Total revenue dengan format rupiah */}
              <h3 className="text-xl font-bold mt-1 text-neutral-900">Rp {totalRevenue.toLocaleString('id-ID')}</h3>
            </div>
            <div className="bg-purple-50 p-2 rounded-natural">
              <span className="text-2xl">💰</span>
            </div>
          </div>
          <p className="text-neutral-600 text-xs">Pesanan selesai</p>
        </div>
      </div>

      {/* Quick Actions - Shortcuts ke halaman penting */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Action Card 1: Link ke Halaman Menu Kue */}
        <Link href="/dashboard/cakes">
          {/* Card dengan hover effects */}
          <div className="card-natural p-5 hover:shadow-md transition cursor-pointer border-2 border-transparent hover:border-primary-500">
            {/* Header dengan icon dan judul */}
            <div className="flex items-center mb-3">
              {/* Icon dengan background */}
              <div className="bg-primary-50 p-3 rounded-natural mr-3">
                <span className="text-3xl">🍰</span>
              </div>
              <div>
                {/* Judul action */}
                <h2 className="text-lg font-display font-bold text-neutral-800">Menu Kue</h2>
                {/* Subtitle */}
                <p className="text-xs text-neutral-500">Kelola produk</p>
              </div>
            </div>
            {/* Deskripsi action */}
            <p className="text-neutral-600 text-sm">
              Tambah, edit, dan hapus menu kue Anda
            </p>
          </div>
        </Link>

        {/* Action Card 2: Link ke Halaman Rekening */}
        <Link href="/dashboard/payment">
          <div className="card-natural p-5 hover:shadow-md transition cursor-pointer border-2 border-transparent hover:border-primary-500">
            <div className="flex items-center mb-3">
              <div className="bg-primary-50 p-3 rounded-natural mr-3">
                <span className="text-3xl">💳</span>
              </div>
              <div>
                <h2 className="text-lg font-display font-bold text-neutral-800">Rekening</h2>
                <p className="text-xs text-neutral-500">Info pembayaran</p>
              </div>
            </div>
            <p className="text-neutral-600 text-sm">
              Kelola informasi rekening pembayaran
            </p>
          </div>
        </Link>

        {/* Action Card 3: Link ke Halaman Pesanan */}
        <Link href="/dashboard/orders">
          <div className="card-natural p-5 hover:shadow-md transition cursor-pointer border-2 border-transparent hover:border-primary-500">
            <div className="flex items-center mb-3">
              <div className="bg-primary-50 p-3 rounded-natural mr-3">
                <span className="text-3xl">📦</span>
              </div>
              <div>
                <h2 className="text-lg font-display font-bold text-neutral-800">Pesanan</h2>
                <p className="text-xs text-neutral-500">Kelola order</p>
              </div>
            </div>
            <p className="text-neutral-600 text-sm">
              Lihat dan kelola pesanan pelanggan
            </p>
          </div>
        </Link>
      </div>

      {/* Recent Orders - Daftar pesanan terbaru */}
      <div className="card-natural p-5">
        {/* Header section dengan judul dan link */}
        <div className="flex justify-between items-center mb-5">
          {/* Judul section */}
          <h2 className="text-xl font-display font-bold text-neutral-800">Pesanan Terbaru</h2>
          {/* Link ke halaman orders lengkap */}
          <Link href="/dashboard/orders" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
            Lihat Semua →
          </Link>
        </div>
        
        {/* Conditional rendering: tampilkan empty state jika belum ada pesanan */}
        {recentOrders.length === 0 ? (
          // Empty state
          <div className="text-center py-8 text-neutral-500">
            <span className="text-4xl mb-2 block">📭</span>
            <p className="text-sm">Belum ada pesanan masuk</p>
          </div>
        ) : (
          // List pesanan - Loop semua recent orders
          <div className="space-y-3">
            {recentOrders.map((order: any) => (
              // Card untuk setiap pesanan
              <div key={order.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-natural hover:bg-neutral-100 transition border border-neutral-200">
                {/* Info customer dan tanggal */}
                <div className="flex-1">
                  {/* Nama customer */}
                  <h3 className="font-semibold text-neutral-800 text-sm">{order.customerName}</h3>
                  {/* Jumlah item dan tanggal pesanan */}
                  <p className="text-xs text-neutral-600">
                    {order.orderItems.length} item • {new Date(order.createdAt).toLocaleDateString('id-ID')}
                  </p>
                </div>
                {/* Total harga pesanan */}
                <div className="text-right mr-4">
                  <p className="font-bold text-neutral-800 text-sm">
                    {/* Hitung total dari semua order items */}
                    Rp {order.orderItems.reduce((sum: number, item: any) => sum + (item.cakePrice * item.quantity), 0).toLocaleString('id-ID')}
                  </p>
                </div>
                {/* Badge status dengan warna conditional */}
                <span className={`px-3 py-1 rounded-natural text-xs font-medium ${
                  order.status === 'menunggu' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : // Kuning untuk menunggu
                  order.status === 'diproses' ? 'bg-blue-100 text-blue-800 border border-blue-200' :     // Biru untuk diproses
                  'bg-green-100 text-green-800 border border-green-200'                                   // Hijau untuk selesai
                }`}>
                  {/* Capitalize first letter dari status */}
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
