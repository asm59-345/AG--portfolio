import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const envUser = process.env.ADMIN_USERNAME || "admin";
        const envPass = process.env.ADMIN_PASSWORD || "secure_admin_password";

        if (
          credentials?.username === envUser &&
          credentials?.password === envPass
        ) {
          return { id: "1", name: "Ashmit Gautam Admin", email: "gautamashmit1485@gmail.com" };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: "/admin", // Redirect to dashboard path which will show the login card if unauthenticated
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = "admin";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_nextauth_secret_key_32_chars_long"
});

export { handler as GET, handler as POST };
