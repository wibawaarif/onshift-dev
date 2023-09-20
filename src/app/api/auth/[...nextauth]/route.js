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
          console.log('test');
          const accessToken = signJwtToken(currentUser, req.query.remember);

          return {
            ...currentUser,
            accessToken,
            rememberOption: req.query.remember,
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
  session: {
    jwt: true,
    maxAge: 6 * 24 * 60 * 60,
    strategy: 'jwt',
    async updateSession(session, token) {
      if (token && token.rememberOption) {
        session.maxAge = 30 * 24 * 60 * 60; // Set maxAge to 30 days if rememberOption is true
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        console.log('test');
        const response = await fetch(`http://localhost:3000/api/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: profile.email,
            username: profile.name,
            type: "google",
          }),
        });

        if (response.status === 500) {
          return "/signin?message=Email already exist";
        }
        return true;
      }

      return true;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.user = {
          _id: user._id,
          email: user.email,
          name: user.username,
          accessToken: user.accessToken,
        };
      }

      if (account) {
        const accessToken = signJwtToken(user);
        token.user = {
          _id: user.id,
          email: user.email,
          name: user.name,
          accessToken: accessToken
        };
        
      }  
      return token;
    },
    async session({ session, token, user }) {
      if (token) {
        session.user._id = token.user._id;
        session.user.name = token.user.name
        session.user.accessToken = token.user.accessToken;
      }
      return session;
    },
  },
  secret: process.env.JWT_SECRET,
});

export { handler as GET, handler as POST };
