'use client';

import { IconDefinition, faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';

export default function AudioPlayer() {
  const [icon, setIcon] = useState<IconDefinition>(faPlay);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    audioRef.current?.addEventListener('playing', () => {
      // console.log('PLAYING');
    });

    audioRef.current?.addEventListener('timeupdate', () => {
      // console.log(audioRef.current?.currentTime);
    });
  }, []);

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
    <div className="flex flex-col items-center gap-2 w-full">
      <progress className="progress progress-primary w-full md:w-3/5 xl:w-2/5" value={1} max="6"></progress>

      <button className="btn btn-ghost" onClick={togglePlayer}>
        <FontAwesomeIcon icon={icon} className="w-6 h-6" />
      </button>

      <audio ref={audioRef} className="hidden" src="/daily_song.mp3" />
    </div>
  );
}
