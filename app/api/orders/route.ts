// Import utilities Next.js untuk response
import { NextResponse } from "next/server";
// Import untuk autentikasi session
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
// Import Prisma client untuk database
import { prisma } from "@/lib/prisma";
import { saveUpload } from "@/lib/uploads";

// GET handler: Mengambil semua pesanan dengan detail items
export async function GET() {
  try {
    // Cek apakah user sudah login (seller)
    const session = await getServerSession(authOptions);
    
    // Jika belum login, return 401 Unauthorized
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Query semua pesanan dengan relasi ke orderItems dan cake
    const orders = await prisma.order.findMany({
      include: {
        orderItems: {
          include: {
            cake: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc' // Urutkan dari terbaru
      }
    });

    // Return daftar pesanan sebagai JSON
    return NextResponse.json(orders);
  } catch (error) {
    // Log error dan return 500 Internal Server Error
    console.error("Get orders error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// POST handler: Membuat pesanan baru dari customer (public endpoint)
export async function POST(request: Request) {
  try {
    // Parse FormData (karena ada file upload bukti pembayaran)
    const formData = await request.formData();
    const customerName = formData.get("customerName") as string;
    const whatsappNumber = formData.get("whatsappNumber") as string;
    const pickupDate = formData.get("pickupDate") as string;
    const pickupTime = formData.get("pickupTime") as string;
    const paymentProofFile = formData.get("paymentProof") as File;
    const orderItemsJson = formData.get("orderItems") as string;

    // Validasi: pastikan semua field wajib terisi
    if (!customerName || !whatsappNumber || !pickupDate || !pickupTime || !paymentProofFile || !orderItemsJson) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    // Parse JSON orderItems dari string
    const orderItems = JSON.parse(orderItemsJson);

    // Simpan bukti pembayaran ke local public/uploads
    const paymentProofUrl = await saveUpload(paymentProofFile);

    // Buat order beserta order items dalam satu transaksi
    const order = await prisma.order.create({
      data: {
        customerName,
        whatsappNumber,
        pickupDate: new Date(pickupDate),
        pickupTime,
        paymentProofUrl,
        status: "menunggu", // Status default: menunggu konfirmasi
        orderItems: {
          create: orderItems.map((item: any) => ({
            cakeId: item.cakeId,
            quantity: item.quantity,
            cakeName: item.cakeName,
            cakePrice: item.cakePrice
          }))
        }
      },
      include: {
        orderItems: true
      }
    });

    // Return pesanan yang baru dibuat dengan status 201 Created
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    // Log error dan return 500 Internal Server Error
    console.error("Create order error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
