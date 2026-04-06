// Import tipe dari next-auth
import NextAuth, { DefaultSession } from "next-auth"

// Extend tipe NextAuth untuk menambahkan field custom (id dan role)
declare module "next-auth" {
  // Extend interface Session untuk menambahkan id dan role ke user
  interface Session {
    user: {
      id: string    // User ID dari database
      role: string  // Role user (seller)
    } & DefaultSession["user"] // Plus field default (name, email, image)
  }

  // Extend interface User untuk menambahkan id dan role
  interface User {
    id: string    // User ID dari database
    role: string  // Role user (seller)
  }
}
