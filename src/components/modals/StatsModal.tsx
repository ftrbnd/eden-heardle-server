'use client';

import SignInButton from '../buttons/SignInButton';
import { MouseEvent, useState } from 'react';
import { IconDefinition, faArrowTrendUp, faBullseye, faCalendarDays, faCopy, faPercent, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import useGuesses from '@/hooks/useGuesses';
import useDailySong from '@/hooks/useDailySong';
import useStatistics from '@/hooks/useStatistics';
import statusSquares from '@/utils/statusSquares';

const StatBox = ({ stat, title, icon, tooltip }: { stat: any; title: string; icon: IconDefinition; tooltip?: string }) => {
  return (
    <div className="stat shadow bg-base-200 rounded-box">
      <div className="stat-figure text-secondary">
        <FontAwesomeIcon icon={icon} className="w-8 h-8" />
      </div>
      <div className="stat-title">{title}</div>
      <div className="tooltip" data-tip={tooltip}>
        <div className="stat-value text-left">{stat}</div>
      </div>
    </div>
  );
};

function Stats() {
  const { stats } = useStatistics();

  return (
    <div className="grid grid-rows-3 sm:grid-cols-2 gap-2 py-4">
      <StatBox stat={stats?.gamesPlayed ?? 0} title={'Games Played'} icon={faCalendarDays} />
      <StatBox stat={Math.round(((stats?.gamesWon ?? 0) / (stats?.gamesPlayed || 1)) * 100)} title={'Win Percentage'} icon={faPercent} tooltip={`${stats?.gamesWon ?? 0} games won`} />
      <StatBox
        stat={Math.round(((stats?.accuracy ?? 0) / ((stats?.gamesPlayed || 1) * 6)) * 100)}
        title={'Accuracy'}
        icon={faBullseye}
        tooltip={`${(stats?.gamesPlayed ?? 0) * 6 - (stats?.accuracy ?? 0)} incorrect guesses overall`}
      />
      <StatBox stat={stats?.currentStreak ?? 0} title={'Current Streak'} icon={faArrowTrendUp} />
      <StatBox stat={stats?.maxStreak ?? 0} title={'Max Streak'} icon={faTrophy} />
    </div>
  );
}

export default function StatsModal() {
  const [showSuccess, setShowSuccess] = useState(false);

  const { guesses, guessType } = useGuesses();
  const { dailySong } = useDailySong();

  const copyToClipboard = async (e: MouseEvent) => {
    e.preventDefault();
    if (showSuccess || !guesses) return;

    setShowSuccess(true);
    await navigator.clipboard.writeText(`EDEN Heardle #${dailySong?.heardleDay} ${statusSquares(guesses.map((g) => g.correctStatus)).replace(/\s/g, '')}`);

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
            <kbd className="kbd">{statusSquares(guesses.map((g) => g.correctStatus))}</kbd>
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
