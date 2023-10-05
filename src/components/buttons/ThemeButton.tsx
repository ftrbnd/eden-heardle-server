'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';

export default function ThemeButton() {
  const { theme, setTheme } = useTheme();
  const sunButtonRef = useRef<HTMLButtonElement>(null);
  const moonButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    sunButtonRef.current?.blur();
    moonButtonRef.current?.blur();
  }, [theme]);

  return (
    <label className="swap swap-rotate">
      <input type="checkbox" onClick={() => setTheme(theme === 'lofi' ? 'black' : 'lofi')} />
      <FontAwesomeIcon icon={faMoon} className="w-6 h-6 swap-on" />
      <FontAwesomeIcon icon={faSun} className="w-6 h-6 swap-off" />
    </label>
  );
}
