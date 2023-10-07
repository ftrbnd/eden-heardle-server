import { LeaderboardStats } from '@/app/api/stats/all/route';
import { Statistics } from '@prisma/client';

const statsUrlEndpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/api/stats`;

export const getStats = async () => {
  try {
    const response = await fetch(statsUrlEndpoint, {
      cache: 'no-store'
    });
    if (!response.ok) throw new Error('Failed to get stats');

    const { stats }: { stats: Statistics } = await response.json();
    if (!stats) return null;

    return stats;
  } catch (err) {
    console.error(err);
  }
};

export const updateStats = async (guessedSong: boolean) => {
  try {
    const response = await fetch(statsUrlEndpoint, {
      method: 'PATCH',
      body: JSON.stringify({ guessedSong: guessedSong }),
      cache: 'no-store'
    });
    if (!response.ok) throw new Error('Failed to update stats');

    const { stats }: { stats: Statistics } = await response.json();
    return stats;
  } catch (err) {
    console.error(err);
  }
};

export const getLeaderboard = async () => {
  try {
    const response = await fetch(`${statsUrlEndpoint}/all`, {
      cache: 'no-store',
      next: {
        revalidate: 30
      }
    });
    if (!response.ok) throw new Error('Failed to get leaderboard');

    const { leaderboard }: { leaderboard: LeaderboardStats } = await response.json();
    console.log('leaderboard from api: ', leaderboard);

    return leaderboard;
  } catch (err) {
    console.error(err);
  }
};
