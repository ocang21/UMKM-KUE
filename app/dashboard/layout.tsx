// Import getServerSession dari NextAuth untuk cek session di server component
import { getServerSession } from "next-auth";
// Import authOptions untuk konfigurasi NextAuth
import { authOptions } from "@/lib/auth";
// Import redirect untuk navigasi server-side
import { redirect } from "next/navigation";
// Import DashboardNav component untuk navigation bar
import DashboardNav from "@/components/dashboard/DashboardNav";

// Layout component untuk semua halaman dashboard
// Melakukan authentication check dan menyediakan layout konsisten
export default async function DashboardLayout({
  children, // Konten halaman yang akan di-render di dalam layout
}: {
  children: React.ReactNode;
}) {
  // Ambil session dari server (tidak perlu useSession karena ini server component)
  const session = await getServerSession(authOptions);

  // Authentication guard: Jika belum login, redirect ke halaman login
  if (!session) {
    redirect("/login");
  }

  // Return layout dashboard
  return (
    // Container utama dengan min height full screen dan background neutral
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Navigation bar dashboard */}
      <DashboardNav />
      {/* Main content area dengan container dan padding khusus mobile (pb-24 agar tidak tertutup bottom bar) */}
      <main className="container mx-auto px-3.5 sm:px-6 py-4 sm:py-6 flex-1 pb-24 md:pb-10">
        {/* Render children (konten halaman spesifik) */}
        {children}
      </main>
    </div>
  );
}
