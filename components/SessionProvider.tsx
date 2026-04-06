// Directive untuk menandakan komponen ini adalah Client Component
// NextAuth SessionProvider harus digunakan di Client Component
'use client';

// Import SessionProvider dari NextAuth dengan alias untuk menghindari naming conflict
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

// Wrapper component untuk NextAuth SessionProvider
// Membungkus aplikasi dengan context session agar semua component bisa akses session
export default function SessionProvider({ children }: { children: React.ReactNode }) {
  // Return NextAuth SessionProvider yang membungkus children
  // Ini memungkinkan useSession() hook bekerja di seluruh aplikasi
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
