'use client';

import SignInButton from '../buttons/SignInButton';
import { useSession } from 'next-auth/react';
import { getStats } from '@/lib/statsApi';
import { useQuery } from '@tanstack/react-query';
import { MouseEvent, useState } from 'react';
import { faArrowTrendUp, faBullseye, faCalendarDays, faCopy, faPercent, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useLocalUser from '@/context/LocalUserProvider';
import { motion } from 'framer-motion';
import useGuesses from '@/hooks/useGuesses';
import useDailySong from '@/hooks/useDailySong';

function Stats() {
  const { data: session } = useSession();
  const localUser = useLocalUser();

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: getStats,
    enabled: session !== null,
    refetchInterval: 30000, // 30 seconds,
    refetchIntervalInBackground: true
  });

  return (
    <div className="grid grid-rows-3 sm:grid-cols-2 gap-2 py-4">
      <div className="stat shadow">
        <div className="stat-figure text-secondary">
          <FontAwesomeIcon icon={faCalendarDays} className="w-8 h-8" />
        </div>
        <div className="stat-title">Games Played</div>
        <div className="stat-value text-left">{session ? stats?.gamesPlayed ?? 0 : localUser.user?.statistics.gamesPlayed}</div>
      </div>

      <div className="stat shadow">
        <div className="stat-figure text-secondary">
          <FontAwesomeIcon icon={faPercent} className="w-8 h-8" />
        </div>
        <div className="stat-title">Win Percentage</div>
        <div className="tooltip" data-tip={`${session ? stats?.gamesWon : localUser.user?.statistics.gamesWon} games won`}>
          <div className="stat-value text-left">
            {session
              ? Math.round(((stats?.gamesWon ?? 0) / (stats?.gamesPlayed || 1)) * 100)
              : Math.round(((localUser.user?.statistics?.gamesWon ?? 0) / (localUser.user?.statistics?.gamesPlayed || 1)) * 100)}
          </div>
        </div>
      </div>

      <div className="stat shadow">
        <div className="stat-figure text-secondary">
          <FontAwesomeIcon icon={faBullseye} className="w-8 h-8" />
        </div>
        <div className="stat-title">Accuracy</div>
        <div
          className="tooltip"
          data-tip={`${
            session ? (stats?.gamesPlayed ?? 0) * 6 - (stats?.accuracy ?? 0) : (localUser.user?.statistics.gamesPlayed ?? 0) * 6 - (localUser.user?.statistics.accuracy ?? 0)
          } incorrect guesses overall`}
        >
          <div className="stat-value text-left">
            {session
              ? Math.round(((stats?.accuracy ?? 0) / ((stats?.gamesPlayed || 1) * 6)) * 100)
              : Math.round(((localUser.user?.statistics.accuracy ?? 0) / ((localUser.user?.statistics.gamesPlayed || 1) * 6)) * 100)}
          </div>
        </div>
      </div>

      <div className="stat shadow">
        <div className="stat-figure text-secondary">
          <FontAwesomeIcon icon={faArrowTrendUp} className="w-8 h-8" />
        </div>
        <div className="stat-title">Current Streak</div>
        <div className="stat-value text-left">{session ? stats?.currentStreak ?? 0 : localUser.user?.statistics.currentStreak}</div>
      </div>

      <div className="stat shadow">
        <div className="stat-figure text-secondary">
          <FontAwesomeIcon icon={faTrophy} className="w-8 h-8" />
        </div>
        <div className="stat-title">Max Streak</div>
        <div className="stat-value text-left">{session ? stats?.maxStreak ?? 0 : localUser.user?.statistics.maxStreak}</div>
      </div>
    </div>
  );
}

export default function StatsModal() {
  const [showSuccess, setShowSuccess] = useState(false);

  const { guesses, guessType } = useGuesses();
  const { dailySong } = useDailySong();

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
    if (showSuccess) return;

    setShowSuccess(true);
    await navigator.clipboard.writeText(`EDEN Heardle #${dailySong?.heardleDay} ${statusSquares().replace(/\s/g, '')}`);

    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <dialog id="stats_modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box min-w-min max-h-80 sm:max-h-max">
        <h3 className="font-bold text-lg">Statistics</h3>
        <Stats />

        {(guesses?.length === 6 || guesses?.at(-1)?.correctStatus === 'CORRECT') && (
          <div className="flex justify-center pb-4">
            <kbd className="kbd">{statusSquares()}</kbd>
          </div>
        )}

        <div className="flex justify-end gap-2">
          {guessType === 'local' && <SignInButton />}
          {(guesses?.length === 6 || guesses?.at(-1)?.correctStatus === 'CORRECT') && (
            <motion.button
              className={`btn ${showSuccess ? 'btn-success' : 'btn-primary'}`}
              onClick={(e) => copyToClipboard(e)}
              whileHover={{
                scale: 1.1,
                transition: {
                  duration: 0.2
                }
              }}
              whileTap={{ scale: 0.9 }}
            >
              {showSuccess ? 'Copied!' : 'Share'}
              <FontAwesomeIcon icon={faCopy} className="h-6 w-6" />
            </motion.button>
          )}
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>Close</button>
      </form>
    </dialog>
  );
}
