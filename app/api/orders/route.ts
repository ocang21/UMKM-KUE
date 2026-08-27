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
        { error: "Semua field wajib diisi lengkap" },
        { status: 400 }
      );
    }

    // Parse JSON orderItems dari string
    let orderItems: any[] = [];
    try {
      orderItems = JSON.parse(orderItemsJson);
    } catch (parseError) {
      return NextResponse.json(
        { error: "Format daftar pesanan tidak valid" },
        { status: 400 }
      );
    }

    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      return NextResponse.json(
        { error: "Keranjang pesanan tidak boleh kosong" },
        { status: 400 }
      );
    }

    // Periksa cakeId yang benar-benar ada di database untuk menghindari Foreign Key constraint violation
    const rawCakeIds = orderItems
      .map((item: any) => item.cakeId)
      .filter((id): id is string => typeof id === "string" && id.length > 0);

    const existingCakes = rawCakeIds.length > 0
      ? await prisma.cake.findMany({
          where: { id: { in: rawCakeIds } },
          select: { id: true }
        })
      : [];

    const validCakeIdSet = new Set(existingCakes.map(c => c.id));

    // Simpan bukti pembayaran ke local public/uploads atau fallback base64
    const paymentProofUrl = await saveUpload(paymentProofFile);

    const parsedPickupDate = new Date(pickupDate);
    const validPickupDate = isNaN(parsedPickupDate.getTime()) ? new Date() : parsedPickupDate;

    // Buat order beserta order items dalam satu transaksi
    const order = await prisma.order.create({
      data: {
        customerName: String(customerName).trim(),
        whatsappNumber: String(whatsappNumber).trim(),
        pickupDate: validPickupDate,
        pickupTime: String(pickupTime).trim(),
        paymentProofUrl,
        status: "menunggu", // Status default: menunggu konfirmasi
        orderItems: {
          create: orderItems.map((item: any) => ({
            cakeId: item.cakeId && validCakeIdSet.has(item.cakeId) ? item.cakeId : null,
            quantity: Math.max(1, Number(item.quantity) || 1),
            cakeName: String(item.cakeName || item.cake?.name || "Kue Pilihan"),
            cakePrice: Math.max(0, Number(item.cakePrice || item.cake?.price) || 0)
          }))
        }
      },
      include: {
        orderItems: true
      }
    });

    // Return pesanan yang baru dibuat dengan status 201 Created
    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    // Log error dan return 500 Internal Server Error
    console.error("Create order error:", error);
    return NextResponse.json(
      { error: error?.message || "Terjadi kesalahan server saat memproses pesanan" },
      { status: 500 }
    );
  }
}
