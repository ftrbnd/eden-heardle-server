'use client';

import SignInButton from '../buttons/SignInButton';
import { useSession } from 'next-auth/react';
import { getStats } from '@/lib/statsApi';
import { useQuery } from '@tanstack/react-query';
import { getDailySong, getGuessedSongs } from '@/lib/songsApi';
import { MouseEvent } from 'react';

function Stats() {
  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: getStats
  });

  return (
    <div className="grid grid-rows-2 sm:grid-cols-2 gap-2 py-4">
      <div className="stat shadow">
        <div className="stat-figure text-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div className="stat-title">Games Played</div>
        <div className="stat-value">{stats?.gamesPlayed ?? 0}</div>
        <div className="stat-desc">Description</div>
      </div>

      <div className="stat shadow">
        <div className="stat-figure text-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            ></path>
          </svg>
        </div>
        <div className="stat-title">Win Percentage</div>
        <div className="stat-value">{Math.round(((stats?.gamesWon ?? 0) / (stats?.gamesPlayed || 1)) * 100)}%</div>
        <div className="stat-desc">Description</div>
      </div>

      <div className="stat shadow">
        <div className="stat-figure text-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
          </svg>
        </div>
        <div className="stat-title">Current Streak</div>
        <div className="stat-value">{stats?.currentStreak ?? 0}</div>
        <div className="stat-desc">Description</div>
      </div>

      <div className="stat shadow">
        <div className="stat-figure text-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
          </svg>
        </div>
        <div className="stat-title">Max Streak</div>
        <div className="stat-value">{stats?.maxStreak ?? 0}</div>
        <div className="stat-desc">Description</div>
      </div>
    </div>
  );
}

export default function StatsModal() {
  const { data: session } = useSession();

  const { data: guesses, isLoading: guessesLoading } = useQuery({
    queryKey: ['guesses'],
    queryFn: getGuessedSongs
  });

  const { data: dailySong } = useQuery({
    queryKey: ['daily'],
    queryFn: getDailySong
  });

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

    return squares.join('');
  };

  const copyToClipboard = async (e: MouseEvent) => {
    e.preventDefault();

    await navigator.clipboard.writeText(`EDEN Heardle #${dailySong?.heardleDay} ${statusSquares()}`);
  };

  return (
    <dialog id="stats_modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box min-w-min">
        <h3 className="font-bold text-lg">Statistics</h3>
        <Stats />
        <div className="flex justify-center">{guessesLoading ? '⬜⬜⬜⬜⬜⬜' : guesses?.length === 6 || guesses?.at(-1)?.correctStatus === 'CORRECT' ? statusSquares() : null}</div>
        {!session && (
          <>
            <div className="divider"></div>
            <div className="flex flex-col items-center">
              <p>Stats are not tracked without an account!</p>
              <p>Sign in to link your stats.</p>
              <p className="font-bold text-lg">TODO: Use localStorage to store stats?</p>
            </div>
            <div className="divider"></div>
          </>
        )}
        <div className="modal-action ">
          <form method="dialog" className="flex gap-2">
            {/* if there is a button in form, it will close the modal */}
            {!session && <SignInButton />}
            {(guesses?.length === 6 || guesses?.at(-1)?.correctStatus === 'CORRECT') && (
              <button className="btn btn-primary" onClick={(e) => copyToClipboard(e)}>
                Share
              </button>
            )}
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
