// Import NextAuth dari library next-auth
import NextAuth from "next-auth";
// Import konfigurasi autentikasi dari lib/auth
import { authOptions } from "@/lib/auth";

// Buat handler NextAuth dengan konfigurasi authOptions
const handler = NextAuth(authOptions);

// Export handler untuk GET dan POST methods
// NextAuth akan handle semua request ke /api/auth/*
export { handler as GET, handler as POST };
