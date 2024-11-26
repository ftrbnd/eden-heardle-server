import AuthSessionProvider from '@/context/AuthSessionProvider';
import TanstackProvider from '@/context/TanstackProvider';
import NextThemesProvider from '@/context/NextThemesProvider';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { LocalUserProvider } from '@/context/LocalUserProvider';
import { ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Script from 'next/script';
import { clientEnv } from '@/utils/env';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EDEN Heardle',
  description: 'Get 6 chances to guess the EDEN song!'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientEnv.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID}`} crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <NextThemesProvider>
          <AuthSessionProvider>
            <TanstackProvider>
              <LocalUserProvider>
                {children}
                <Analytics />
                <SpeedInsights />
              </LocalUserProvider>
            </TanstackProvider>
          </AuthSessionProvider>
        </NextThemesProvider>
        <Analytics />
      </body>
    </html>
  );
}
