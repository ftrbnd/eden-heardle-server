'use client';

import { IconDefinition, faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Song } from '@prisma/client';
import { useTheme } from 'next-themes';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

interface IProps {
  songs?: Song[];
}

export default function AudioPlayer({ songs }: IProps) {
  const [selected, setSelected] = useState('');

  const [icon, setIcon] = useState<IconDefinition>(faPlay);
  const [color, setColor] = useState<'#ffffff' | '#000000'>('#ffffff');
  const audioRef = useRef<HTMLAudioElement>(null);

  const { theme, setTheme } = useTheme();

  const handleSelection = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelected(event.target.value);
  };

  useEffect(() => {
    audioRef.current?.addEventListener('playing', () => {
      console.log('PLAYING');
    });

    audioRef.current?.addEventListener('timeupdate', () => {
      console.log(audioRef.current?.currentTime);
    });
  }, []);

  useEffect(() => {
    if (theme === 'lofi') {
      setColor('#ffffff');
    } else {
      setColor('#000000');
    }
  }, [theme]);

  const togglePlayer = () => {
    if (!audioRef.current) return;

    if (icon === faPlay) {
      audioRef.current?.play();
      setIcon(faPause);
    } else {
      audioRef.current?.pause();
      setIcon(faPlay);
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <div className="flex flex-col gap-2 items-center w-96 md:w-3/5 card shadow-2xl">
      <progress className="progress progress-primary w-56" value={1} max="6"></progress>

      <button className="btn btn-ghost" onClick={togglePlayer}>
        <FontAwesomeIcon icon={icon} className={`w-6 h-6 ${color} `} />
      </button>
      <audio ref={audioRef} className="hidden" src="/daily_song.mp3" />

      <select className="select select-primary w-full max-w-xs" defaultValue={'Choose a Song'} onChange={handleSelection}>
        <option disabled>Choose a Song</option>
        {songs?.map((song) => (
          <option key={song.id} value={song.name}>
            {song.name}
          </option>
        ))}
      </select>
    </div>
  );
}
