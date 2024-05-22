'use client';
import { Toaster } from '@/components/ui/toaster';
import type { Session } from 'next-auth';
import { Inter } from 'next/font/google';
import Providers from './dashboard/components/layout/providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });


export default function RootLayout({
  session,
  children
}: {
  session: Session | null
  children: React.ReactNode;
}) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} overflow-hidden`}>
          <Providers session={session}>
            <Toaster />
            {children}
          </Providers>
        </body>
      </html>
    );
}
