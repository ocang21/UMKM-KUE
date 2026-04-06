// Import utilities Next.js untuk response
import { NextResponse } from "next/server";
// Import untuk autentikasi session
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
// Import Prisma client untuk database
import { prisma } from "@/lib/prisma";
import { saveUpload } from "@/lib/uploads";

// GET handler: Mengambil semua kue milik user yang sedang login
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

    // Query semua kue milik user ini, urutkan dari terbaru
    const cakes = await prisma.cake.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Return daftar kue sebagai JSON
    return NextResponse.json(cakes);
  } catch (error) {
    // Log error dan return 500 Internal Server Error
    console.error("Get cakes error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// POST handler: Menambahkan kue baru dengan upload gambar
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

    // Parse FormData (karena ada file upload)
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const price = parseInt(formData.get("price") as string);
    const isAvailable = formData.get("isAvailable") === "true";
    const imageFile = formData.get("image") as File;

    // Validasi: pastikan semua field wajib terisi
    if (!name || !price || !imageFile) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    // Simpan gambar ke local public/uploads dan ambil URL relatifnya
    const imageUrl = await saveUpload(imageFile);

    // Simpan data kue ke database
    const cake = await prisma.cake.create({
      data: {
        name,
        price,
        imageUrl,
        isAvailable,
        userId: session.user.id
      }
    });

    // Return kue yang baru dibuat dengan status 201 Created
    return NextResponse.json(cake, { status: 201 });
  } catch (error) {
    // Log error dan return 500 Internal Server Error
    console.error("Create cake error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
