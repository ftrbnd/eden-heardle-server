'use client';

import { useSession } from 'next-auth/react';
import AudioPlayer from '../../components/AudioPlayer';
import { useQuery } from '@tanstack/react-query';
import { getDailySong, getGuessedSongs } from '@/lib/songsApi';
import { getSessionUser } from '@/lib/userApi';
import Navbar from '@/components/Navbar';
import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import GuessCard from '@/components/GuessCard';

function Countdown({ nextReset }: { nextReset?: Date | null }) {
  const [timestamp, setTimestamp] = useState(0);
  const [countdown, setCountdown] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    setTimestamp(new Date(nextReset as unknown as string).getTime());
  }, [nextReset]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const timeDifference = timestamp - new Date().getTime() / 1000;

      setCountdown({
        hours: new Date(timeDifference * 1000).getHours(),
        minutes: new Date(timeDifference * 1000).getMinutes(),
        seconds: new Date(timeDifference * 1000).getSeconds()
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timestamp]);

  return (
    <div className="self-end flex flex-col items-center">
      <p className="font-bold text-lg">Next song in:</p>
      <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
        <div className="flex flex-col">
          <span className="countdown font-mono text-5xl">
            <span id="hours" style={{ '--value': countdown.hours }}></span>
          </span>
          hours
        </div>
        <div className="flex flex-col">
          <span className="countdown font-mono text-5xl">
            <span id="minutes" style={{ '--value': countdown.minutes }}></span>
          </span>
          min
        </div>
        <div className="flex flex-col">
          <span className="countdown font-mono text-5xl">
            <span id="seconds" style={{ '--value': countdown.seconds }}></span>
          </span>
          sec
        </div>
      </div>
    </div>
  );
}

export default function PlayContent({ children }: { children: ReactNode }) {
  const { data: session } = useSession();

  const { data: guesses, isLoading: guessesLoading } = useQuery({
    queryKey: ['guesses'],
    queryFn: getGuessedSongs
  });

  const { data: dailySong } = useQuery({
    queryKey: ['daily'],
    queryFn: getDailySong
  });

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: getSessionUser
  });

  const router = useRouter();

  useEffect(() => {
    router.replace('/play');
  }, [router]);

  return (
    <div className="flex flex-col items-center h-full justify-between">
      <Navbar>{children}</Navbar>
      <div className="h-full grid grid-rows-2 py-4">
        <div className="grid grid-rows-6 items-center max-w-fit gap-2">
          {guessesLoading
            ? [1, 2, 3, 4, 5, 6].map((num) => <GuessCard key={num} name="" album="" cover="/default_song.png" />)
            : guesses?.map((song) => <GuessCard key={song.id} name={song.name} album={song.album || ''} cover={song.cover} correctStatus={song.correctStatus} />)}
        </div>
        <Countdown nextReset={dailySong?.nextReset} />
      </div>
      <AudioPlayer dailySong={dailySong} />
    </div>
  );
}
