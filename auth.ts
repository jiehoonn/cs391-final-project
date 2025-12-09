import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { findOrCreateUser } from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        try {
          // Find or create user in MongoDB
          await findOrCreateUser({
            googleId: account.providerAccountId,
            email: profile.email,
            name: profile.name || "Unknown User",
            picture: (profile as any).picture,
          });
          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        // Add Google ID to session
        (session.user as any).googleId = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
});
