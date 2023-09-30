import { options } from '@/app/api/auth/[...nextauth]/options';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';

async function getStats() {
  const session = await getServerSession(options);
  if (!session) return null;

  const stats = await prisma.statistics.findUnique({
    where: {
      userId: session.user.id
    }
  });

  return stats;
}

async function Stats() {
  const stats = await getStats();

  return (
    <div className="grid grid-rows-2 sm:grid-cols-2 gap-2 shadow py-4">
      <div className="stat shadow">
        <div className="stat-figure text-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div className="stat-title">Games Played</div>
        <div className="stat-value">{stats?.gamesPlayed}</div>
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
        <div className="stat-value">{stats?.currentStreak}</div>
        <div className="stat-desc">Description</div>
      </div>

      <div className="stat shadow">
        <div className="stat-figure text-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
          </svg>
        </div>
        <div className="stat-title">Max Streak</div>
        <div className="stat-value">{stats?.maxStreak}</div>
        <div className="stat-desc">Description</div>
      </div>
    </div>
  );
}

export default function StatsModal() {
  return (
    <dialog id="stats_modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box min-w-min">
        <h3 className="font-bold text-lg">Statistics</h3>
        <Stats />
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
