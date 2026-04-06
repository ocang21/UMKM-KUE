// Import utilities Next.js untuk response
import { NextResponse } from "next/server";
// Import untuk autentikasi session
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
// Import Prisma client untuk database
import { prisma } from "@/lib/prisma";

// PUT handler: Update data rekening pembayaran
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Cek autentikasi user
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse JSON body
    const { bankName, accountNumber, accountName } = await request.json();

    // Cari rekening berdasarkan ID
    const existingAccount = await prisma.paymentAccount.findUnique({
      where: { id: params.id }
    });

    if (!existingAccount) {
      return NextResponse.json(
        { error: "Rekening tidak ditemukan" },
        { status: 404 }
      );
    }

    // Jika bukan milik user, return 403 Forbidden
    if (existingAccount.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Update rekening di database
    const updatedAccount = await prisma.paymentAccount.update({
      where: { id: params.id },
      data: {
        bankName,
        accountNumber,
        accountName
      }
    });

    // Return rekening yang sudah diupdate
    return NextResponse.json(updatedAccount);
  } catch (error) {
    // Log error dan return 500 Internal Server Error
    console.error("Update payment account error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// DELETE handler: Menghapus rekening pembayaran
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Cek autentikasi user
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Cari rekening berdasarkan ID
    const account = await prisma.paymentAccount.findUnique({
      where: { id: params.id }
    });

    if (!account) {
      return NextResponse.json(
        { error: "Rekening tidak ditemukan" },
        { status: 404 }
      );
    }

    // Jika bukan milik user, return 403 Forbidden
    if (account.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Hapus rekening dari database
    await prisma.paymentAccount.delete({
      where: { id: params.id }
    });

    // Return konfirmasi berhasil
    return NextResponse.json({ message: "Rekening berhasil dihapus" });
  } catch (error) {
    // Log error dan return 500 Internal Server Error
    console.error("Delete payment account error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
