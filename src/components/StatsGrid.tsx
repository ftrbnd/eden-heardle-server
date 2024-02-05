import { LocalStatistics } from '@/utils/types';
import { IconDefinition } from '@fortawesome/free-brands-svg-icons';
import { faCalendarDays, faPercent, faBullseye, faArrowTrendUp, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function StatBox({ stat, title, icon, tooltip, loading }: { stat: any; title: string; icon: IconDefinition; tooltip?: string; loading?: boolean }) {
  return (
    <div className="stat shadow bg-base-200 rounded-box">
      <div className="stat-figure text-secondary">
        <FontAwesomeIcon icon={icon} className="w-8 h-8" />
      </div>
      <div className="stat-title">{title}</div>
      <div className="tooltip" data-tip={tooltip}>
        {loading ? <div className="skeleton h-8 w-16"></div> : <div className="stat-value text-left">{stat}</div>}
      </div>
    </div>
  );
}

function StatsGrid({ stats, loading }: { stats: LocalStatistics | null | undefined; loading?: boolean }) {
  return (
    <div className="grid grid-rows-3 sm:grid-cols-2 gap-2 py-4">
      <StatBox loading={loading} stat={stats?.gamesPlayed ?? 0} title={'Games Played'} icon={faCalendarDays} />
      <StatBox
        loading={loading}
        stat={Math.round(((stats?.gamesWon ?? 0) / (stats?.gamesPlayed || 1)) * 100)}
        title={'Win Percentage'}
        icon={faPercent}
        tooltip={`${stats?.gamesWon ?? 0} games won`}
      />
      <StatBox
        loading={loading}
        stat={Math.round(((stats?.accuracy ?? 0) / ((stats?.gamesPlayed || 1) * 6)) * 100)}
        title={'Accuracy'}
        icon={faBullseye}
        tooltip={`${(stats?.gamesPlayed ?? 0) * 6 - (stats?.accuracy ?? 0)} incorrect guesses overall`}
      />
      <StatBox loading={loading} stat={stats?.currentStreak ?? 0} title={'Current Streak'} icon={faArrowTrendUp} />
      <StatBox loading={loading} stat={stats?.maxStreak ?? 0} title={'Max Streak'} icon={faTrophy} />
    </div>
  );
}

export default StatsGrid;
