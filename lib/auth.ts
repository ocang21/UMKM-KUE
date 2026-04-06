// Import types dan utilities dari NextAuth untuk konfigurasi autentikasi
import { NextAuthOptions } from "next-auth";
// Import Credentials Provider untuk autentikasi dengan email/password
import CredentialsProvider from "next-auth/providers/credentials";
// Import Prisma client untuk akses database
import { prisma } from "@/lib/prisma";
// Import bcrypt untuk compare password yang di-hash
import bcrypt from "bcryptjs";

// Konfigurasi NextAuth untuk autentikasi aplikasi
// Mendefinisikan providers, callbacks, dan strategi session
export const authOptions: NextAuthOptions = {
  // Array providers yang digunakan untuk autentikasi
  providers: [
    // Credentials Provider: Autentikasi dengan email dan password
    CredentialsProvider({
      name: "Credentials", // Nama provider
      // Definisi fields yang dibutuhkan untuk login
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      // Fungsi authorize dipanggil saat user mencoba login
      async authorize(credentials) {
        // Validasi: Cek apakah email dan password ada
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan password wajib diisi");
        }

        // Query database untuk mencari user berdasarkan email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        // Cek apakah user ditemukan
        if (!user) {
          throw new Error("Email atau password salah");
        }

        // Verify password: Compare password input dengan hash di database
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        // Cek apakah password valid
        if (!isPasswordValid) {
          throw new Error("Email atau password salah");
        }

        // Jika semua validasi sukses, return user object
        // Object ini akan di-pass ke JWT callback
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    })
  ],
  // Callbacks untuk memodifikasi JWT dan session
  callbacks: {
    // JWT callback: Dipanggil saat JWT token dibuat atau diupdate
    async jwt({ token, user }) {
      // Jika user ada (saat pertama kali login), tambahkan data ke token
      if (user) {
        token.id = user.id;     // Tambahkan user ID ke token
        token.role = user.role; // Tambahkan role ke token
      }
      return token; // Return token yang sudah dimodifikasi
    },
    // Session callback: Dipanggil saat session data diakses di client
    async session({ session, token }) {
      // Tambahkan data dari token ke session object
      if (session.user) {
        session.user.id = token.id as string;     // Tambahkan user ID
        session.user.role = token.role as string; // Tambahkan role
      }
      return session; // Return session yang sudah dimodifikasi
    }
  },
  // Konfigurasi halaman custom untuk autentikasi
  pages: {
    signIn: "/login", // Redirect ke /login jika belum login
  },
  // Konfigurasi session strategy
  session: {
    strategy: "jwt", // Gunakan JWT (stateless) bukan database session
  },
  // Secret key untuk signing JWT tokens (dari environment variable)
  secret: process.env.NEXTAUTH_SECRET,
};
