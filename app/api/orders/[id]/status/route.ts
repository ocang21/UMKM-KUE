// Import utilities Next.js untuk response
import { NextResponse } from "next/server";
// Import untuk autentikasi session
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
// Import Prisma client untuk database
import { prisma } from "@/lib/prisma";

// PATCH handler: Update status pesanan (menunggu/diproses/selesai)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Cek autentikasi seller
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse JSON body untuk mendapatkan status baru
    const { status } = await request.json();

    // Validasi: status harus salah satu dari 3 opsi valid
    if (!["menunggu", "diproses", "selesai"].includes(status)) {
      return NextResponse.json(
        { error: "Status tidak valid" },
        { status: 400 }
      );
    }

    // Update status pesanan di database
    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status },
      include: {
        orderItems: true // Include items untuk response
      }
    });

    // Return pesanan yang sudah diupdate
    return NextResponse.json(order);
  } catch (error) {
    // Log error dan return 500 Internal Server Error
    console.error("Update order status error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
