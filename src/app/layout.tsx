import AuthSessionProvider from '@/context/AuthSessionProvider';
import TanstackProvider from '@/context/TanstackProvider';
import NextThemesProvider from '@/context/NextThemesProvider';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EDEN Heardle',
  description: 'Get 6 chances to guess the EDEN song'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NextThemesProvider>
          <AuthSessionProvider>
            <TanstackProvider>{children}</TanstackProvider>
          </AuthSessionProvider>
        </NextThemesProvider>
      </body>
    </html>
  );
}
