'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';

export default function ThemeButton() {
  const [icon, setIcon] = useState<IconDefinition>(faMoon);
  const [color, setColor] = useState<'#ffffff' | '#000000'>('#ffffff');

  const { theme, setTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (theme === 'lofi') {
      setIcon(faMoon);
      setColor('#ffffff');
    } else {
      setIcon(faSun);
      setColor('#000000');
    }

    buttonRef.current?.blur();
  }, [theme]);

  return (
    <button ref={buttonRef} className="btn btn-ghost" onClick={() => setTheme(theme === 'lofi' ? 'black' : 'lofi')}>
      <FontAwesomeIcon icon={icon} className={`w-6 h-6 ${color} `} />
    </button>
  );
}
