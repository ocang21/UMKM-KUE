// Import utilities Next.js untuk response
import { NextResponse } from "next/server";
// Import untuk autentikasi session
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
// Import Prisma client untuk database
import { prisma } from "@/lib/prisma";

// GET handler: Mengambil semua rekening pembayaran milik user
export async function GET(request: Request) {
  try {
    // Cek apakah user sudah login dengan session
    const session = await getServerSession(authOptions);
    
    // Jika belum login, return 401 Unauthorized
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Query semua rekening pembayaran milik user ini
    const paymentAccounts = await prisma.paymentAccount.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc' // Urutkan dari terbaru
      }
    });

    // Return daftar rekening sebagai JSON
    return NextResponse.json(paymentAccounts);
  } catch (error) {
    // Log error dan return 500 Internal Server Error
    console.error("Get payment accounts error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// POST handler: Menambahkan rekening pembayaran baru
export async function POST(request: Request) {
  try {
    // Cek autentikasi user
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse JSON body (tidak ada file upload di endpoint ini)
    const { bankName, accountNumber, accountName } = await request.json();

    // Validasi: pastikan semua field wajib terisi
    if (!bankName || !accountNumber || !accountName) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    // Simpan rekening pembayaran baru ke database
    const paymentAccount = await prisma.paymentAccount.create({
      data: {
        bankName,
        accountNumber,
        accountName,
        userId: session.user.id
      }
    });

    // Return rekening yang baru dibuat dengan status 201 Created
    return NextResponse.json(paymentAccount, { status: 201 });
  } catch (error) {
    // Log error dan return 500 Internal Server Error
    console.error("Create payment account error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
