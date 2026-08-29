// Import utilities Next.js untuk response
import { NextResponse } from "next/server";
// Import Prisma client untuk database
import { prisma } from "@/lib/prisma";
import { saveDataUrl } from "@/lib/uploads";

export const dynamic = "force-dynamic";

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

    const normalizedCakes = await Promise.all(
      cakes.map(async (cake) => {
        if (cake.imageUrl?.startsWith("data:image/")) {
          try {
            const imageUrl = await saveDataUrl(cake.imageUrl);
            await prisma.cake.update({
              where: { id: cake.id },
              data: { imageUrl },
            });
            return { ...cake, imageUrl };
          } catch (error) {
            console.error("Normalize available cake image error:", cake.id, error);
          }
        }
        return cake;
      })
    );

    // Return daftar kue yang ready
    return NextResponse.json(normalizedCakes);
  } catch (error) {
    // Log error dan return 500 Internal Server Error
    console.error("Get available cakes error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
