'use client';

import useDailySong from '@/hooks/useDailySong';
import useGuesses from '@/hooks/useGuesses';
import { IconDefinition, faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';

export default function AudioPlayer() {
  const [second, setSecond] = useState(0);
  const [icon, setIcon] = useState<IconDefinition>(faPlay);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { guesses } = useGuesses();
  const { dailySong, dailySongLoading } = useDailySong();

  useEffect(() => {
    const handleTimeUpdate = () => {
      let currentSecond = 0;
      if (audioRef.current) {
        currentSecond = audioRef.current.currentTime;

        if (currentSecond >= 6) {
          pauseSong();
        }

        setSecond(audioRef.current.currentTime);
      }

      if (guesses && currentSecond >= guesses?.length + 1 && !finishedGame()) {
        pauseSong();
      }
    };

    const currentAudio = audioRef.current;
    if (currentAudio) currentAudio.volume = 0.5;
    currentAudio?.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      if (currentAudio) {
        currentAudio.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };
  });

  const pauseSong = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIcon(faPlay);

      audioRef.current.currentTime = 0;
    }
  };

  const playSong = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;

      audioRef.current.play();
      setIcon(faPause);
    }
  };

  const togglePlayer = () => {
    icon === faPlay ? playSong() : pauseSong();
  };

  const finishedGame = () => {
    return guesses?.at(-1)?.correctStatus === 'CORRECT' || guesses?.length === 6;
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <progress className="progress progress-primary w-full md:w-3/5 xl:w-2/5" value={second} max="6"></progress>

      <div className="flex justify-between pt-2 w-full md:w-3/5 xl:w-2/5">
        <kbd className="kbd">00:{String(Math.floor(second)).padStart(2, '0')}</kbd>
        {dailySongLoading ? (
          <button className="btn btn-ghost btn-disabled">
            <span className="loading loading-ring loading-md"></span>
          </button>
        ) : (
          <button className="btn btn-ghost" onClick={togglePlayer}>
            <FontAwesomeIcon icon={icon} className="w-6 h-6" />
          </button>
        )}
        <kbd className="kbd">00:06</kbd>
      </div>

      <audio ref={audioRef} className="hidden" src={dailySong?.link} />
    </div>
  );
}
