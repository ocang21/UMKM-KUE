// Import utilities Next.js untuk response
import { NextResponse } from "next/server";
// Import Prisma client untuk database
import { prisma } from "@/lib/prisma";
// Import bcrypt untuk hashing password
import bcrypt from "bcryptjs";

// POST handler: Registrasi seller baru
export async function POST(request: Request) {
  try {
    // Parse JSON body
    const { email, password, name } = await request.json();

    // Validasi: pastikan semua field terisi
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    // Cek apakah email sudah terdaftar di database
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    // Hash password dengan bcrypt (10 rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru dengan role "seller"
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: "seller"
      }
    });

    // Return sukses dengan data user (tanpa password)
    return NextResponse.json({
      message: "Registrasi berhasil",
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    }, { status: 201 });

  } catch (error) {
    // Log error dan return 500 Internal Server Error
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
