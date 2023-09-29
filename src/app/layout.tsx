import AuthSessionProvider from '@/context/AuthSessionProvider';
import TanstackProvider from '@/context/TanstackProvider';
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
    <html lang="en">
      <body className={inter.className}>
        <AuthSessionProvider>
          <TanstackProvider>{children}</TanstackProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
