import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSiteSettings, saveSiteSettings } from "@/lib/settings-server";

export const dynamic = "force-dynamic";

// GET (Public): Mengambil seluruh konten & konfigurasi website
export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json({ error: "Gagal memuat pengaturan" }, { status: 500 });
  }
}

// PUT (Protected): Memperbarui konten halaman dari dashboard pengelola
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const updated = await saveSiteSettings(body);

    return NextResponse.json({
      message: "Konten website berhasil disimpan!",
      settings: updated,
    });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json({ error: "Gagal menyimpan perubahan konten" }, { status: 500 });
  }
}
