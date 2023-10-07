'use client';

import { getGuessedSongs } from '@/lib/songsApi';
import { IconDefinition, faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

export default function AudioPlayer() {
  const [second, setSecond] = useState(0.0);
  const [icon, setIcon] = useState<IconDefinition>(faPlay);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { data: guesses } = useQuery({
    queryKey: ['guesses'],
    queryFn: getGuessedSongs,
    refetchInterval: 30000, // 30 seconds,
    refetchIntervalInBackground: true
  });

  useEffect(() => {
    const handleTimeUpdate = () => {
      if (currentAudio) {
        // update time for progress bar and timer
        setSecond(currentAudio.currentTime);
      }

      if (currentAudio && guesses?.length) {
        if (Math.floor(currentAudio.currentTime) > guesses.length) {
          // time passes their allowed time
          pauseSong();
        }
      }
    };

    const currentAudio = audioRef.current;
    currentAudio?.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      if (currentAudio) {
        currentAudio.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };
  }, [guesses?.length]);

  const pauseSong = () => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    setIcon(faPlay);
    audioRef.current.currentTime = 0;
  };

  const playSong = () => {
    if (!audioRef.current) return;

    audioRef.current.play();
    setIcon(faPause);
  };

  const togglePlayer = () => {
    icon === faPlay ? playSong() : pauseSong();
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <progress className="progress progress-primary w-full md:w-3/5 xl:w-2/5" value={second} max="6"></progress>

      <div className="flex justify-between pt-2 w-full md:w-3/5 xl:w-2/5">
        <kbd className="kbd">00:{String(Math.floor(second)).padStart(2, '0')}</kbd>
        <button className="btn btn-ghost" onClick={togglePlayer}>
          <FontAwesomeIcon icon={icon} className="w-6 h-6" />
        </button>
        <kbd className="kbd">00:06</kbd>
      </div>

      <audio ref={audioRef} className="hidden" src="/daily_song.mp3" />
    </div>
  );
}
