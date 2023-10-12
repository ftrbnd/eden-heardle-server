import { getUserStats } from '@/lib/statsApi';
import { faCalendarDays, faPercent, faBullseye, faArrowTrendUp, faTrophy, faGem } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Statistics, User } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';

function Stats({ userStats }: { userStats: Statistics }) {
  return (
    <div className="grid grid-rows-3 sm:grid-cols-2 gap-2 py-4">
      <div className="stat shadow">
        <div className="stat-figure text-secondary">
          <FontAwesomeIcon icon={faCalendarDays} className="w-8 h-8" />
        </div>
        <div className="stat-title">Games Played</div>
        <div className="stat-value text-left">{userStats.gamesPlayed}</div>
      </div>

      <div className="stat shadow">
        <div className="stat-figure text-secondary">
          <FontAwesomeIcon icon={faPercent} className="w-8 h-8" />
        </div>
        <div className="stat-title">Win Percentage</div>
        <div className="tooltip" data-tip={`${userStats.gamesWon} games won`}>
          <div className="stat-value text-left">{Math.round(((userStats?.gamesWon ?? 0) / (userStats?.gamesPlayed || 1)) * 100)}</div>
        </div>
      </div>

      <div className="stat shadow">
        <div className="stat-figure text-secondary">
          <FontAwesomeIcon icon={faBullseye} className="w-8 h-8" />
        </div>
        <div className="stat-title">Accuracy</div>
        <div className="tooltip" data-tip={`${(userStats.gamesPlayed ?? 0) * 6 - (userStats.accuracy ?? 0)} incorrect guesses overall`}>
          <div className="stat-value text-left">{Math.round(((userStats.accuracy ?? 0) / ((userStats.gamesPlayed || 1) * 6)) * 100)}</div>
        </div>
      </div>

      <div className="stat shadow">
        <div className="stat-figure text-secondary">
          <FontAwesomeIcon icon={faArrowTrendUp} className="w-8 h-8" />
        </div>
        <div className="stat-title">Current Streak</div>
        <div className="stat-value text-left">{userStats.currentStreak ?? 0}</div>
      </div>

      <div className="stat shadow">
        <div className="stat-figure text-secondary">
          <FontAwesomeIcon icon={faTrophy} className="w-8 h-8" />
        </div>
        <div className="stat-title">Max Streak</div>
        <div className="stat-value text-left">{userStats.currentStreak ?? 0}</div>
      </div>
    </div>
  );
}

export default function ProfileModal({ user }: { user: User }) {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['stats', user.id],
    queryFn: () => getUserStats(user.id)
  });

  return (
    <dialog id={`profile_${user.id}_modal`} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box min-w-min max-h-80 sm:max-h-max">
        <div className="grid grid-cols-2">
          <div className="flex justify-start items-center gap-2">
            <h3 className="font-bold text-2xl place-self-start self-center">{user.name}</h3>
            {user.earlySupporter && (
              <div className="tooltip" data-tip="Early Supporter">
                <FontAwesomeIcon className="w-6 h-6 text-accent" icon={faGem} />
              </div>
            )}
          </div>
          <div className="avatar place-self-end">
            <div className="w-16 rounded-full">
              <Image src={user.image || '/default.png'} alt={`${user.name}'s Avatar`} height={100} width={100} />
            </div>
          </div>
        </div>
        {!isLoading && stats && <Stats userStats={stats} />}
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>Close</button>
      </form>
    </dialog>
  );
}
