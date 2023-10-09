'use client';

import { useSession } from 'next-auth/react';
import AudioPlayer from '../../components/AudioPlayer';
import { useQuery } from '@tanstack/react-query';
import { getDailySong, getGuessedSongs } from '@/lib/songsApi';
import Navbar from '@/components/Navbar';
import { CSSProperties, ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import GuessCard from '@/components/GuessCard';
import SongSelectInput from '@/components/SongSelectInput';
import useLocalUser from '@/context/LocalUserProvider';

interface CountdownProps {
  song: string;
  guessedSong: boolean;
}

interface CSSPropertiesWithVars extends CSSProperties {
  '--value': number;
}

function Countdown({ song, guessedSong }: CountdownProps) {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const now = new Date();

    const currentUTCHours = now.getUTCHours();
    const currentUTCMinutes = now.getUTCMinutes();
    const currentUTCSeconds = now.getUTCSeconds();

    const targetHour = 3;
    const targetMinute = 0;
    const targetSecond = 0;

    let hoursRemaining = (targetHour - currentUTCHours + 24) % 24;
    let minutesRemaining = (targetMinute - currentUTCMinutes + 60) % 60;
    let secondsRemaining = (targetSecond - currentUTCSeconds + 60) % 60;

    const intervalId = setInterval(() => {
      secondsRemaining--;
      setSeconds(secondsRemaining);
      setMinutes(minutesRemaining);
      setHours(hoursRemaining);

      if (secondsRemaining < 0) {
        secondsRemaining = 59;
        minutesRemaining--;
        setSeconds(secondsRemaining);
        setMinutes(minutesRemaining);

        if (minutesRemaining < 0) {
          minutesRemaining = 59;
          hoursRemaining--;
          setMinutes(minutesRemaining);
          setHours(hoursRemaining);

          if (hoursRemaining < 0) {
            setHours(hoursRemaining);
            clearInterval(intervalId);
            console.log('Countdown to 4 AM UTC has reached 0!');
          }
        }
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="self-end flex flex-col items-center text-center gap-1 p-2">
      <div className="row-span-full text-center">
        <h1 className="text-3xl font-bold">{guessedSong ? "Great job on today's puzzle!" : `The song was ${song}`}</h1>
        <p className="py-6">{guessedSong ? 'Check back tomorrow for a new song.' : 'Try again tomorrow!'}</p>
      </div>
      <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
        <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
          <span className="countdown font-mono text-3xl sm:text-5xl">
            <span id="hours" style={{ '--value': hours } as CSSPropertiesWithVars}></span>
          </span>
          hours
        </div>
        <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
          <span className="countdown font-mono text-3xl sm:text-5xl">
            <span id="minutes" style={{ '--value': minutes } as CSSPropertiesWithVars}></span>
          </span>
          min
        </div>
        <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
          <span className="countdown font-mono text-3xl sm:text-5xl">
            <span id="seconds" style={{ '--value': seconds } as CSSPropertiesWithVars}></span>
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
    queryFn: getGuessedSongs,
    enabled: session !== null,
    refetchInterval: 30000, // 30 seconds,
    refetchIntervalInBackground: true
  });

  const { data: dailySong } = useQuery({
    queryKey: ['daily'],
    queryFn: getDailySong
  });

  useEffect(() => {
    router.replace('/play');
  }, [router]);

  if (sessionStatus === 'loading') {
    return (
      <div className="flex flex-col items-center h-full justify-between">
        <Navbar>{children}</Navbar>
        <div className="grid grid-rows-2-auto gap-1 px-4 w-full h-full">
          <div className="grid grid-rows-6 w-4/5 md:w-3/5 xl:w-2/5 gap-2 place-self-center">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <GuessCard key={num} name="" album="" cover="/default_song.png" />
            ))}
          </div>
        </div>
        <div className="grid grid-rows-2-auto flex-col gap-2 items-center w-full card shadow-2xl px-4 pb-4">
          <SongSelectInput dailySong={dailySong} />
          <AudioPlayer />
        </div>
      </div>
    );
  } else if (sessionStatus === 'authenticated') {
    return (
      <div className="flex flex-col items-center h-full justify-between">
        <Navbar>{children}</Navbar>
        <div className="grid grid-rows-2-auto gap-1 px-4 w-full h-full">
          <div className="grid grid-rows-6 w-4/5 md:w-3/5 xl:w-2/5 gap-2 place-self-center">
            {guessesFetched && guesses?.map((song) => <GuessCard key={song.id} name={song.name} album={song.album || ''} cover={song.cover} correctStatus={song.correctStatus} />)}
            {guesses?.length === 0 && (
              <div className="row-span-full text-center">
                <h1 className="text-5xl font-bold">Hello there</h1>
                <p className="py-6">Press play and choose a song to get started!</p>
              </div>
            )}
          </div>

          {(guesses?.length === 6 || guesses?.at(-1)?.correctStatus === 'CORRECT') && <Countdown song={dailySong?.name || ''} guessedSong={guesses?.at(-1)?.correctStatus === 'CORRECT'} />}
        </div>
        <div className="grid grid-rows-2-auto flex-col gap-2 items-center w-full card shadow-2xl px-4 pb-4">
          <SongSelectInput dailySong={dailySong} />
          <AudioPlayer />
        </div>
      </div>
    );
  } else if (sessionStatus === 'unauthenticated') {
    return (
      <div className="flex flex-col items-center h-full justify-between">
        <Navbar>{children}</Navbar>
        <div className="grid grid-rows-2-auto gap-1 px-4 w-full h-full">
          <div className="grid grid-rows-6 w-4/5 md:w-3/5 xl:w-2/5 gap-2 place-self-center">
            {localUser.user?.guesses.map((song, index) => (
              <GuessCard key={index} name={song.name} album={song.album || ''} cover={song.cover} correctStatus={song.correctStatus} />
            ))}
            {localUser.user?.guesses.length === 0 && (
              <div className="row-span-full text-center">
                <h1 className="text-5xl font-bold">Hello there</h1>
                <p className="py-6">Press play and choose a song to get started!</p>
              </div>
            )}
          </div>

          {(localUser.user?.guesses.length === 6 || localUser.user?.guesses.at(-1)?.correctStatus === 'CORRECT') && (
            <Countdown song={dailySong?.name || ''} guessedSong={localUser.user?.guesses?.at(-1)?.correctStatus === 'CORRECT'} />
          )}
        </div>
        <div className="grid grid-rows-2-auto flex-col gap-2 items-center w-full card shadow-2xl px-4 pb-4">
          <SongSelectInput dailySong={dailySong} />
          <AudioPlayer />
        </div>
      </div>
    );
  }
}
