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
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-cream-300">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-primary-900 tracking-tight">
            Selamat Datang, {session?.user.name}!
          </h1>
          <p className="text-neutral-600 text-xs sm:text-sm mt-0.5">
            Berikut ringkasan bisnis dan aktivitas toko kue Anda hari ini.
          </p>
        </div>
        <div className="text-xs font-semibold uppercase tracking-wider text-accent-amber px-3 py-1.5 bg-cream-100 rounded-full border border-cream-300 w-fit">
          Status: Toko Aktif
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Menu Kue */}
        <div className="bg-white p-5 rounded-xl border border-cream-300 shadow-warm-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-neutral-500 text-xs uppercase tracking-wider font-semibold">Total Menu</p>
              <h3 className="text-2xl font-display font-bold mt-1 text-primary-900">{totalCakes}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center text-primary-800 font-display font-bold text-base border border-cream-200">
              🍰
            </div>
          </div>
          <p className="text-neutral-500 text-[11px]">Varian kue aktif</p>
        </div>

        {/* Card 2: Total Pesanan */}
        <div className="bg-white p-5 rounded-xl border border-cream-300 shadow-warm-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-neutral-500 text-xs uppercase tracking-wider font-semibold">Total Pesanan</p>
              <h3 className="text-2xl font-display font-bold mt-1 text-primary-900">{totalOrders}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center text-primary-800 font-display font-bold text-base border border-cream-200">
              📦
            </div>
          </div>
          <p className="text-neutral-500 text-[11px]">Semua transaksi</p>
        </div>

        {/* Card 3: Pesanan Menunggu (Pending) */}
        <div className="bg-white p-5 rounded-xl border border-cream-300 shadow-warm-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-neutral-500 text-xs uppercase tracking-wider font-semibold">Perlu Konfirmasi</p>
              <h3 className="text-2xl font-display font-bold mt-1 text-amber-800">{pendingOrders}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-800 font-display font-bold text-base border border-amber-200">
              ⏳
            </div>
          </div>
          <p className="text-amber-800 text-[11px] font-medium">Status menunggu</p>
        </div>

        {/* Card 4: Total Pendapatan */}
        <div className="bg-white p-5 rounded-xl border border-cream-300 shadow-warm-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-neutral-500 text-xs uppercase tracking-wider font-semibold">Pendapatan</p>
              <h3 className="text-xl font-display font-bold mt-1 text-primary-800">
                Rp {totalRevenue.toLocaleString('id-ID')}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-800 font-display font-bold text-base border border-green-200">
              💰
            </div>
          </div>
          <p className="text-neutral-500 text-[11px]">Pesanan selesai</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/dashboard/cakes">
          <div className="bg-white p-5 rounded-xl border border-cream-300 hover:border-primary-500 hover:shadow-warm-md transition cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cream-100 flex items-center justify-center text-lg">
                🍰
              </div>
              <div>
                <h2 className="text-base font-display font-bold text-primary-900 group-hover:text-primary-700">
                  Menu Kue
                </h2>
                <p className="text-[11px] text-neutral-500">Kelola dan update produk kue</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/dashboard/orders">
          <div className="bg-white p-5 rounded-xl border border-cream-300 hover:border-primary-500 hover:shadow-warm-md transition cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cream-100 flex items-center justify-center text-lg">
                📦
              </div>
              <div>
                <h2 className="text-base font-display font-bold text-primary-900 group-hover:text-primary-700">
                  Daftar Pesanan
                </h2>
                <p className="text-[11px] text-neutral-500">Pantau dan update status pesanan</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/dashboard/payment">
          <div className="bg-white p-5 rounded-xl border border-cream-300 hover:border-primary-500 hover:shadow-warm-md transition cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cream-100 flex items-center justify-center text-lg">
                💳
              </div>
              <div>
                <h2 className="text-base font-display font-bold text-primary-900 group-hover:text-primary-700">
                  Rekening Toko
                </h2>
                <p className="text-[11px] text-neutral-500">Kelola nomor rekening pembayaran</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/dashboard/content">
          <div className="bg-white p-5 rounded-xl border border-cream-300 hover:border-primary-500 hover:shadow-warm-md transition cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cream-100 flex items-center justify-center text-lg">
                ⚙️
              </div>
              <div>
                <h2 className="text-base font-display font-bold text-primary-900 group-hover:text-primary-700">
                  Kelola Konten
                </h2>
                <p className="text-[11px] text-neutral-500">Edit teks & isi tiap halaman</p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Orders Table / Cards */}
      <div className="bg-white rounded-xl border border-cream-300 shadow-warm-sm p-6">
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-cream-200">
          <h2 className="text-lg font-display font-bold text-primary-900">
            Pesanan Terbaru
          </h2>
          <Link href="/dashboard/orders" className="text-xs font-semibold text-primary-800 hover:text-accent-amber transition uppercase tracking-wider">
            Lihat Semua →
          </Link>
        </div>
        
        {recentOrders.length === 0 ? (
          <div className="text-center py-8 text-neutral-500">
            <p className="text-xs">Belum ada pesanan masuk.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order: any) => (
              <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-cream-50/50 rounded-lg border border-cream-200 gap-3">
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-primary-900 text-sm">{order.customerName}</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {order.orderItems.length} item • {new Date(order.createdAt).toLocaleDateString('id-ID')}
                  </p>
                </div>
                <div className="sm:text-right">
                  <p className="font-bold text-primary-900 text-sm font-sans">
                    Rp {order.orderItems.reduce((sum: number, item: any) => sum + (item.cakePrice * item.quantity), 0).toLocaleString('id-ID')}
                  </p>
                </div>
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase ${
                    order.status === 'menunggu' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                    order.status === 'diproses' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                    'bg-green-100 text-green-800 border border-green-200'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
