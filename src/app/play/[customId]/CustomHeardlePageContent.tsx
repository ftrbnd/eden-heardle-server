'use client';

import GuessCard from '@/components/GuessCard';
import { ProfileDropdown } from '@/components/Navbar';
import ThemeButton from '@/components/buttons/ThemeButton';
import AudioPlayer from '@/components/custom-heardle/AudioPlayer';
import SongSelectInput from '@/components/custom-heardle/SongSelectInput';
import OpenModalButton from '@/components/modals/OpenModalButton';
import { getCustomHeardle } from '@/lib/customHeardleApi';
import { CustomHeardle, GuessedSong, User } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { MouseEvent, ReactNode, useState } from 'react';
import Image from 'next/image';
import { getUser } from '@/lib/usersApi';
import { Session } from 'next-auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

interface ResultCardProps {
  song: CustomHeardle;
  guessedSong: boolean;
  creator?: User;
  session: Session | null;
  guesses: GuessedSong[];
}

interface PageProps {
  params: { customId: string };
  children: ReactNode;
}

function CustomHeardlePageNavbar({ children }: { children: ReactNode }) {
  const { data: session } = useSession();

  return (
    <div className="navbar bg-base-200">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li>
              <OpenModalButton modalId="rules_modal" modalTitle="Rules" />
            </li>
          </ul>
        </div>
        <Link href={'/'} className="btn btn-ghost normal-case text-xl">
          EDEN Heardle
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <OpenModalButton modalId="rules_modal" modalTitle="Rules" />
          </li>
        </ul>
      </div>

      {children}

      <div className="navbar-end menu menu-horizontal px-1">
        <li>
          <ThemeButton />
        </li>
        {session ? (
          <ProfileDropdown session={session} />
        ) : (
          <li>
            <OpenModalButton modalId="settings_modal" modalTitle="Settings" />
          </li>
        )}
      </div>
    </div>
  );
}

function CustomResultCard({ song, guessedSong, creator, session, guesses }: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  const statusSquares = (): string => {
    function getStatusSquare(status: string) {
      switch (status) {
        case 'CORRECT':
          return '🟩';
        case 'ALBUM':
          return '🟧';
        case 'WRONG':
          return '🟥';
        default:
          return '⬜';
      }
    }

    let squares: string[] = [];
    guesses?.forEach((guess) => {
      squares.push(getStatusSquare(guess.correctStatus));
    });

    return squares.join(' ');
  };

  const copyToClipboard = async (e: MouseEvent) => {
    e.preventDefault();
    if (copied) return;

    setCopied(true);
    await navigator.clipboard.writeText(`EDEN Heardle #${creator?.name} ${statusSquares().replace(/\s/g, '')}`);

    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <div className="self-end w-4/5 md:w-3/5 xl:w-2/5 card bg-base-100 shadow-xl image-full overflow-hidden mb-4 mt-4">
      <figure>
        <Image src={song?.cover ?? ''} alt={song?.name} fill style={{ objectFit: 'cover' }} priority />
      </figure>
      <div className="card-body items-center">
        <h2 className="font-bold text-center text-lg sm:text-xl md:text-2xl">{guessedSong ? "Great job on today's puzzle!" : `The song was ${song?.name}`}</h2>
        <p className="text-md">This custom Heardle was created by {creator?.name}</p>
        {!session && <p className="text-sm">Sign in to create your own!</p>}
        <div className="card-actions">
          <button className={`btn ${copied ? 'btn-success' : 'btn-primary'}`} onClick={(e) => copyToClipboard(e)}>
            {copied ? 'Copied!' : 'Share'}
            <FontAwesomeIcon icon={faCopy} className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CustomHeardlePageContent({ params, children }: PageProps) {
  const [customGuesses, setCustomGuesses] = useState<GuessedSong[]>([]);

  const { data: session } = useSession();

  const { data: song, isLoading: songLoading } = useQuery({
    queryKey: ['customHeardle', params.customId],
    queryFn: () => getCustomHeardle(params.customId)
  });

  const { data: user } = useQuery({
    queryKey: ['customHeardleCreator'],
    queryFn: () => getUser(song!.userId),
    enabled: !!song?.userId
  });

  return (
    <div className="flex flex-col items-center h-full">
      <CustomHeardlePageNavbar>{children}</CustomHeardlePageNavbar>
      <div className="grid grid-rows-2-auto place-items-center gap-1 px-4 w-full h-full pt-4">
        <div className="grid grid-rows-6 w-4/5 md:w-3/5 xl:w-2/5 gap-2 place-self-center">
          {customGuesses.map((song, index) => (
            <GuessCard key={index} name={song.name} album={song.album || ''} cover={song.cover} correctStatus={song.correctStatus} />
          ))}
          {customGuesses.length === 0 && (
            <div className="row-span-full text-center">
              <h1 className="text-5xl font-bold">Hello there</h1>
              <p className="py-6">Press play and choose a song to get started!</p>
            </div>
          )}
        </div>

        {customGuesses.length === 6 || customGuesses.at(-1)?.correctStatus === 'CORRECT' ? (
          <CustomResultCard song={song!} guessedSong={customGuesses?.at(-1)?.correctStatus === 'CORRECT'} creator={user!} session={session} guesses={customGuesses} />
        ) : (
          <div></div>
        )}
      </div>
      <div className="grid grid-rows-2-auto flex-col gap-2 items-center w-full card shadow-2xl px-4 pb-4">
        <SongSelectInput customSong={song} guessedSongs={customGuesses} setGuessedSongs={setCustomGuesses} />
        <AudioPlayer guessedSongs={customGuesses} customSong={song} songLoading={songLoading} />
      </div>
    </div>
  );
}
