import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "@/models/user";
import { signJwtToken } from "@/lib/jwt";
import bcrypt from "bcrypt";
import connect from "@/utils/db";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {
        username: { label: "Email", type: "text", placeholder: "John Doe" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials;
        await connect();

        const user = await User.findOne({ email });

        if (!user) {
          throw new Error("Email unregistered");
        }

        const comparePass = await bcrypt.compare(password, user.password);
        if (!comparePass) {
          throw new Error("Invalid credentials");
        } else {
          const { ...currentUser } = user._doc;

          const accessToken = signJwtToken(currentUser, { expiresIn: 6 * 24 * 60 * 60, });

          return {
            ...currentUser,
            accessToken
          };
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  database: process.env.MONGO_URI,
  jwt: {
    maxAge: 6 * 24 * 60 * 60,
  },
  session: {
    jwt: true,
    maxAge: 6 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
          const response = await fetch(`/api/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: profile.email,
              username: profile.name,
              type: 'google',
            }),
          });
          
          if (response.status === 500) {
            return '/signin?message=Email already exist'
          }
        return true;
      }

      return true
    },
  },
  secret: process.env.JWT_SECRET,
});

export { handler as GET, handler as POST };
