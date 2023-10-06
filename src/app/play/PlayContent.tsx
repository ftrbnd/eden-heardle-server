'use client';

import { useSession } from 'next-auth/react';
import AudioPlayer from '../../components/AudioPlayer';
import { useQuery } from '@tanstack/react-query';
import { getDailySong, getGuessedSongs } from '@/lib/songsApi';
import Navbar from '@/components/Navbar';
import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import GuessCard from '@/components/GuessCard';
import SongSelectInput from '@/components/SongSelectInput';
import useLocalUser from '@/context/LocalUserProvider';

interface CountdownProps {
  nextReset?: Date | null;
  song: string;
  guessedSong: boolean;
}

function Countdown({ nextReset, song, guessedSong }: CountdownProps) {
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
    <div className="self-end flex flex-col items-center text-center gap-1">
      <p className="font-bold text-md sm:text-lg">{guessedSong ? "Great job on today's puzzle! Check back tomorrow for a new song." : `The song was "${song}", try again tomorrow!`}</p>
      <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
        <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
          <span className="countdown font-mono text-3xl sm:text-5xl">
            <span id="hours" style={{ '--value': countdown.hours }}></span>
          </span>
          hours
        </div>
        <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
          <span className="countdown font-mono text-3xl sm:text-5xl">
            <span id="minutes" style={{ '--value': countdown.minutes }}></span>
          </span>
          min
        </div>
        <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
          <span className="countdown font-mono text-3xl sm:text-5xl">
            <span id="seconds" style={{ '--value': countdown.seconds }}></span>
          </span>
          sec
        </div>
      </div>
    </div>
  );
}

export default function PlayContent({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const localUser = useLocalUser();

  const { data: guesses, isFetched: guessesFetched } = useQuery({
    queryKey: ['guesses'],
    queryFn: getGuessedSongs
  });

  const { data: dailySong } = useQuery({
    queryKey: ['daily'],
    queryFn: getDailySong
  });

  useEffect(() => {
    router.replace('/play');
  }, [router]);

  return (
    <div className="flex flex-col items-center h-full justify-between">
      <Navbar>{children}</Navbar>
      <div className="grid grid-rows-2-auto gap-1 px-4 w-full h-full">
        <div className="grid grid-rows-6 w-4/5 md:w-3/5 xl:w-2/5 gap-2 place-self-center">
          {sessionStatus === 'loading' && !guessesFetched
            ? [1, 2, 3, 4, 5, 6].map((num) => <GuessCard key={num} name="" album="" cover="/default_song.png" />)
            : sessionStatus === 'authenticated' && guessesFetched
            ? guesses?.map((song) => <GuessCard key={song.id} name={song.name} album={song.album || ''} cover={song.cover} correctStatus={song.correctStatus} />)
            : localUser.user?.guesses.map((song, index) => <GuessCard key={index} name={song.name} album={song.album || ''} cover={song.cover} correctStatus={song.correctStatus} />)}
          {session && guesses?.length === 0 && (
            <div className="row-span-full text-center">
              <h1 className="text-5xl font-bold">Hello there</h1>
              <p className="py-6">Press play and choose a song to get started!</p>
            </div>
          )}
          {!session && localUser.user?.guesses.length === 0 && (
            <div className="row-span-full text-center">
              <h1 className="text-5xl font-bold">Hello there</h1>
              <p className="py-6">Press play and choose a song to get started!</p>
            </div>
          )}
        </div>

        {session
          ? (guesses?.length === 6 || guesses?.at(-1)?.correctStatus === 'CORRECT') && (
              <Countdown nextReset={dailySong?.nextReset} song={dailySong?.name || ''} guessedSong={guesses.at(-1)?.correctStatus === 'CORRECT'} />
            )
          : (localUser.user?.guesses?.length === 6 || localUser.user?.guesses?.at(-1)?.correctStatus === 'CORRECT') && (
              <Countdown nextReset={dailySong?.nextReset} song={dailySong?.name || ''} guessedSong={localUser.user?.guesses.at(-1)?.correctStatus === 'CORRECT'} />
            )}
      </div>
      <div className="grid grid-rows-2-auto flex-col gap-2 items-center w-full card shadow-2xl px-4 pb-4">
        <SongSelectInput dailySong={dailySong} />
        <AudioPlayer />
      </div>
    </div>
  );
}
