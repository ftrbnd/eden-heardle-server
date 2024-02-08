import { LeaderboardStats } from '@/utils/types';

const LEADERBOARD_ENDPOINT = '/api/leaderboard';

export const getLeaderboard = async () => {
  try {
    const response = await fetch(LEADERBOARD_ENDPOINT, {
      cache: 'no-store'
    });
    if (!response.ok) throw new Error('Failed to get leaderboard');

    const { leaderboard }: { leaderboard: LeaderboardStats } = await response.json();
    return leaderboard;
  } catch (err) {
    throw new Error(`Failed to get leaderboard`);
  }
};
