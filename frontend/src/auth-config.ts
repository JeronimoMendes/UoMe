import { NextAuthOptions } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import { signIn } from './api/auth-service';

export const authConfig: NextAuthOptions = {
  providers: [
    CredentialProvider({
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
          const user = await signIn(credentials);
          if (user) {
            return user;
          } else {
            return null;
          }
        } catch (error) {
          console.error(error);
          return null;
        }

      }
    })
  ],
  pages: {
    signIn: '/login' //sigup page
  },
  callbacks: {
    authorized({ auth, request: { nextUrl }}) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    }
  }
};
