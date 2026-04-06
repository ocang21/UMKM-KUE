// Import utilities Next.js untuk response
import { NextResponse } from "next/server";
// Import Prisma client untuk database
import { prisma } from "@/lib/prisma";

// GET handler (PUBLIC): Mengambil 1 rekening pembayaran terbaru untuk customer
export async function GET() {
  try {
    // Query 1 rekening terbaru (take: 1), urutkan dari terbaru
    const paymentAccounts = await prisma.paymentAccount.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 1 // Hanya ambil 1 rekening
    });

    // Return rekening pertama atau null jika belum ada
    return NextResponse.json(paymentAccounts[0] || null);
  } catch (error) {
    // Log error dan return 500 Internal Server Error
    console.error("Get public payment account error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
