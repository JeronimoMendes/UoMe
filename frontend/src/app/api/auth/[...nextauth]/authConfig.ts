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

console.log(process.env.GOOGLE_CLIENT_ID);

console.log(process.env.GOOGLE_CLIENT_SECRET);

console.log(process.env.JWT_SECRET);


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
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    })
  ],
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({ token, user, account  }: { token: any, user: any, account: any}) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
        token.token = user.token || account?.id_token
      }
      return token;
    },
    async session({ session, token, user }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.username = token.username || token.name;
        session.user.email = token.email;
        // encode token
        session.user.token = token.token || token.access_token;
      }
      return session;
    }
  },
  secret: process.env.JWT_SECRET
};

export default authConfig;
