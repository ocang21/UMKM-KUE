// Import utilities Next.js untuk response
import { NextResponse } from "next/server";
// Import untuk autentikasi session
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
// Import Prisma client untuk database
import { prisma } from "@/lib/prisma";
import { deleteUpload, saveUpload } from "@/lib/uploads";

// GET handler: Mengambil detail kue berdasarkan ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Cari kue berdasarkan ID
    const cake = await prisma.cake.findUnique({
      where: { id: params.id }
    });

    // Jika tidak ditemukan, return 404
    if (!cake) {
      return NextResponse.json(
        { error: "Kue tidak ditemukan" },
        { status: 404 }
      );
    }

    // Return data kue
    return NextResponse.json(cake);
  } catch (error) {
    // Log error dan return 500 Internal Server Error
    console.error("Get cake error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// PUT handler: Update data kue existing (termasuk gambar optional)
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

    // Parse FormData
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const price = parseInt(formData.get("price") as string);
    const isAvailable = formData.get("isAvailable") === "true";
    const imageFile = formData.get("image") as File | null;

    // Cek apakah kue exist dan milik user ini
    const existingCake = await prisma.cake.findUnique({
      where: { id: params.id }
    });

    if (!existingCake) {
      return NextResponse.json(
        { error: "Kue tidak ditemukan" },
        { status: 404 }
      );
    }

    // Jika bukan milik user, return 403 Forbidden
    if (existingCake.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Gunakan gambar existing sebagai default
    let imageUrl = existingCake.imageUrl;

    // Jika ada gambar baru, simpan ke local uploads dan hapus gambar lama
    if (imageFile && imageFile.size > 0) {
      imageUrl = await saveUpload(imageFile);
      await deleteUpload(existingCake.imageUrl);
    }

    // Update data kue di database
    const updatedCake = await prisma.cake.update({
      where: { id: params.id },
      data: {
        name,
        price,
        imageUrl,
        isAvailable
      }
    });

    // Return kue yang sudah diupdate
    return NextResponse.json(updatedCake);
  } catch (error) {
    // Log error dan return 500 Internal Server Error
    console.error("Update cake error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// DELETE handler: Menghapus kue beserta gambarnya
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

    // Cari kue berdasarkan ID
    const cake = await prisma.cake.findUnique({
      where: { id: params.id }
    });

    if (!cake) {
      return NextResponse.json(
        { error: "Kue tidak ditemukan" },
        { status: 404 }
      );
    }

    // Jika bukan milik user, return 403 Forbidden
    if (cake.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Hapus image file lokal jika ada
    await deleteUpload(cake.imageUrl);

    // Hapus kue dari database
    await prisma.cake.delete({
      where: { id: params.id }
    });

    // Return konfirmasi berhasil
    return NextResponse.json({ message: "Kue berhasil dihapus" });
  } catch (error) {
    // Log error dan return 500 Internal Server Error
    console.error("Delete cake error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
