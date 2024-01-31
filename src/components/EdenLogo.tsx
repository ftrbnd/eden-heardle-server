'use client';

import { useTheme } from 'next-themes';
import Image from 'next/image';

interface LogoProps {
  height: number;
  width: number;
}

export default function EdenLogo({ height, width }: LogoProps) {
  const { theme } = useTheme();

  return <Image className="self-center" src={`${theme === 'dark' ? '/icon.png' : '/icon-black.png'}`} alt="EDEN logo" height={height} width={width} />;
}
