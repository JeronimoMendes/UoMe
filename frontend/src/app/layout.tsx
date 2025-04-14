'use client';
import { Toaster } from '@/components/ui/sonner';
import { SessionProvider } from 'next-auth/react';
import { Inter } from 'next/font/google';
import ThemeProvider from './dashboard/components/layout/ThemeToggle/theme-provider';
import './globals.css';
import CookieConsentBanner from "../components/CookieConsentBanner";

const inter = Inter({ subsets: ['latin'] });


export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SessionProvider>
              {children}
              <Toaster richColors/>
              <CookieConsentBanner />
            </SessionProvider>
          </ThemeProvider>
      </body>
    </html>
  );
}
