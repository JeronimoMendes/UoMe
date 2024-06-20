import { signIn } from '@/api/auth-service';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from "next-auth/providers/google";


interface IJwtPayload extends JwtPayload {
  user: {
    id: string;
    username: string;
    email: string;
  }
}

async function refreshAccessToken(token) {
  try {
    const url =
      "https://oauth2.googleapis.com/token?" +
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      })
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.id_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    }
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

const authConfig: NextAuthOptions = {
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

          const token_decoded = jwtDecode(access_token) as IJwtPayload;
          const user = {
            id: token_decoded.user.id,
            username: token_decoded.user.username,
            email: token_decoded.user.email,
            token: access_token
          }
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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: { params: { access_type: "offline", prompt: "consent" } },
    })
  ],
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({ token, user, account  }: { token: any, user: any, account: any}) {
      if (user && account) {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
        token.token = user.token || account?.id_token;
        token.accessTokenExpires = Date.now() + account.expires_in * 1000;
        token.refreshToken = account.refresh_token;

        return token;
      }

      if (Date.now() < token.accessTokenExpires) {
        return token
      }

      return refreshAccessToken(token);
    },
    async session({ session, token, user }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.username = token.username || token.name;
        session.user.email = token.email;
        // encode token
        session.user.token = token.token || token.access_token;
        session.user.refreshToken = token.refreshToken;
      }
      return session;
    }
  },
  secret: process.env.JWT_SECRET
};

export default authConfig;
