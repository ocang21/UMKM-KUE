// Import utilities Next.js untuk response
import { NextResponse } from "next/server";
// Import Prisma client untuk database
import { prisma } from "@/lib/prisma";

// GET handler (PUBLIC): Mengambil semua kue yang ready/tersedia untuk customer
export async function GET() {
  try {
    // Query kue yang statusnya isAvailable = true, urutkan terbaru
    const cakes = await prisma.cake.findMany({
      where: {
        isAvailable: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Return daftar kue yang ready
    return NextResponse.json(cakes);
  } catch (error) {
    // Log error dan return 500 Internal Server Error
    console.error("Get available cakes error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
