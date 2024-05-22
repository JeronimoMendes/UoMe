import { signIn } from "@/api/auth-service";
import { jwtDecode } from "jwt-decode";
import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        username: {
          type: 'text',
          label: 'Username',
          placeholder: 'joedoe@example.com'
        },
        password: {
          type: 'password',
          label: 'Password'
        }
      },
      async authorize(credentials, req) {
        if (!credentials) {
          return null;
        }
        try {
          const creds = {
            email: credentials?.username,
            password: credentials?.password
          };
          const tokenResponse = await signIn(creds);
          const access_token = tokenResponse.access_token;

          const token_decoded = jwtDecode(access_token);
          const user = {
            id: token_decoded.user.id,
            username: token_decoded.user.username,
            email: token_decoded.user.email
          }
          console.log(user);

          if (user) {
            return user;
          } else {
            return null;
          }
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.email = token.email;
      return session;
    }
  },
  secret: process.env.JWT_SECRET
};

const handler = NextAuth(authConfig)

export { handler as GET, handler as POST };
