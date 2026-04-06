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
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation bar dashboard */}
      <DashboardNav />
      {/* Main content area dengan container dan padding */}
      <main className="container mx-auto px-4 py-6">
        {/* Render children (konten halaman spesifik) */}
        {children}
      </main>
    </div>
  );
}
