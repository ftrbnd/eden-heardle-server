'use client';

import { GuessCard } from '@/components/GuessCard';
import Navbar from '@/app/play/content/Navbar';
import { DailySong, GuessedSong } from '@prisma/client';
import { ReactNode, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { correctlyGuessedHeardle, finishedHeardle } from '@/utils/userGuesses';
import WelcomeCard from '@/app/play/content/WelcomeCard';
import ResultCard from '../../content/ResultCard';
import AudioPlayer from '../../content/AudioPlayer';
import SongSelectInput from '../../content/SongSelectInput';

interface PageProps {
  children: ReactNode;
}

export default function UnlimitedPageContent({ children }: PageProps) {
  const [unlimitedGuesses, setUnlimitedGuesses] = useState<GuessedSong[]>([]);

  const [unlimitedSong, setUnlimitedSong] = useState<DailySong>();
  const [songLoading, setSongLoading] = useState(false);

  /** TODO: figure out how to get Unlimited Heardle song
    Maybe: allow unlimited for all signed-in users, and use the EDEN Heardle Server to delete all from database/storage every 24 hours
  */

  return (
    <div className="flex flex-col items-center h-full">
      <Navbar>{children}</Navbar>
      <div className="grid grid-rows-2-auto place-items-center gap-1 px-4 w-full h-full pt-4">
        <AnimatePresence>
          <div className={`grid ${unlimitedGuesses?.length === 0 ? 'grid-rows-1' : 'grid-rows-6'} w-4/5 md:w-3/5 xl:w-2/5 gap-2 place-self-center`}>
            {unlimitedGuesses.map((song, index) => (
              <GuessCard key={index} name={song.name} album={song.album || ''} cover={song.cover} correctStatus={song.correctStatus} showAnimation={true} />
            ))}
            {unlimitedGuesses.length === 0 && <WelcomeCard heardleType="UNLIMITED" />}
          </div>
        </AnimatePresence>

        {finishedHeardle(unlimitedGuesses) ? (
          <ResultCard song={unlimitedSong!} guessedSong={correctlyGuessedHeardle(unlimitedGuesses)} onUnlimitedHeardlePage otherHeardleGuesses={unlimitedGuesses} />
        ) : (
          <div></div>
        )}
      </div>
      <div className="grid grid-rows-2-auto flex-col gap-2 items-center w-full card shadow-2xl px-4 pb-4">
        <SongSelectInput heardleSong={unlimitedSong!} guesses={unlimitedGuesses} setOtherGuesses={setUnlimitedGuesses} />
        <AudioPlayer song={unlimitedSong!} songLoading={songLoading} guesses={unlimitedGuesses} />
      </div>
    </div>
  );
}
