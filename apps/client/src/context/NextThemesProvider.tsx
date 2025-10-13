'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

export default function NextThemesProvider({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
