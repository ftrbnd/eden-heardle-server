'use client';

import AudioPlayer from '../../components/AudioPlayer';
import Navbar from '@/components/Navbar';
import { CSSProperties, Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GuessCard } from '@/components/GuessCard';
import SongSelectInput from '@/components/SongSelectInput';
import { DailySong } from '@prisma/client';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import useGuesses from '@/hooks/useGuesses';
import useDailySong from '@/hooks/useDailySong';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import OpenModalButton from '@/components/modals/OpenModalButton';
import EdenLogo from '@/components/EdenLogo';
import { correctlyGuessedHeardle, finishedHeardle } from '@/utils/userGuesses';
interface CountdownProps {
  song: DailySong;
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
    <motion.div
      className="self-end w-4/5 md:w-3/5 xl:w-2/5 card bg-base-100 shadow-xl image-full overflow-hidden mb-4 mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 3 }}
    >
      <figure>
        <Image src={song?.cover ?? ''} alt={song?.name} fill style={{ objectFit: 'cover' }} priority />
      </figure>
      <div className="card-body items-center">
        <h2 className="font-bold text-center text-lg sm:text-xl md:text-2xl">{guessedSong ? "Great job on today's puzzle!" : `The song was ${song?.name}`}</h2>
        <p className="text-md">{guessedSong ? 'Check back tomorrow for a new song.' : 'Try again tomorrow!'}</p>
        <div className="card-actions justify-center">
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
        <OpenModalButton modalId="stats_modal" modalTitle="View Statistics" className="btn btn-outline " />
      </div>
    </motion.div>
  );
}

interface WelcomeProps {
  heardleDay?: number | null | undefined;
}

function WelcomeCard({ heardleDay }: WelcomeProps) {
  return (
    <div className="card w-full bg-base-200 shadow-xl">
      <div className="card-body">
        <div className="flex justify-center items-center gap-4">
          <EdenLogo height={50} width={50} />
          <h1 className="text-3xl lg:text-5xl font-bold text-center">Day {heardleDay ?? 0}</h1>
        </div>
        <p className="lg:text-lg text-center">Press play and choose a song to get started!</p>
      </div>
    </div>
  );
}

interface AnnouncementProps {
  setShowBanner: Dispatch<SetStateAction<boolean>>;
  announcement: string;
}

function AnnouncementBanner({ setShowBanner, announcement }: AnnouncementProps) {
  return (
    <div className="flex justify-center items-center bg-success text-success-content w-full h-min p-2">
      <div className="btn btn-ghost px-1 sm:px-2">{announcement}</div>
      <button className="btn btn-ghost px-1 sm:px-2" onClick={() => setShowBanner(false)}>
        <FontAwesomeIcon icon={faClose} className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function PlayContent({ children }: { children: ReactNode }) {
  const [showBanner, setShowBanner] = useState(false);

  const { guesses, loadingGuessType } = useGuesses();
  const { dailySong } = useDailySong();
  const router = useRouter();

  // used to get rid of url created for showing rules modal
  useEffect(() => {
    router.replace('/play');
  }, [router]);

  return (
    <div className="flex flex-col items-center h-full justify-between">
      {showBanner && <AnnouncementBanner setShowBanner={setShowBanner} announcement="announcement" />}
      <Navbar>{children}</Navbar>
      <div className="grid grid-rows-2-auto place-items-center gap-1 px-4 w-full h-full pt-4">
        <AnimatePresence>
          <div className={`grid ${guesses?.length === 0 ? 'grid-rows-1' : 'grid-rows-6'} w-4/5 md:w-3/5 xl:w-2/5 gap-2 place-self-center`}>
            {loadingGuessType ? (
              [1, 2, 3, 4, 5, 6].map((num) => <GuessCard key={num} name="" album="" cover="/default_song.png" showAnimation={false} />)
            ) : (
              <>
                {guesses?.map((song, index) => (
                  <GuessCard key={index} name={song.name} album={song.album || ''} cover={song.cover} correctStatus={song.correctStatus} showAnimation={true} />
                ))}
                {guesses?.length === 0 && <WelcomeCard heardleDay={dailySong?.heardleDay} />}
              </>
            )}
          </div>
        </AnimatePresence>

        {finishedHeardle(guesses) ? <Countdown song={dailySong!} guessedSong={correctlyGuessedHeardle(guesses)} /> : <div></div>}
      </div>
      <div className="grid grid-rows-2-auto flex-col gap-2 items-center w-full card shadow-2xl px-4 pb-4">
        <SongSelectInput dailySong={dailySong} />
        <AudioPlayer />
      </div>
    </div>
  );
}
