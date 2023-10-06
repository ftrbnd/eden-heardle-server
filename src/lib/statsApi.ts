import { LeaderboardStats } from '@/app/api/stats/all/route';
import { Statistics } from '@prisma/client';
import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api`
});

export const statsUrlEndpoint = '/stats';

export const getStats = async () => {
  try {
    const response = await api.get(statsUrlEndpoint);
    if (!response.data) return null;

    const { stats }: { stats: Statistics } = response.data;

    return stats;
  } catch (err) {
    console.error("Failed to get user's stats: ", err);
  }
};

export const updateStats = async (guessedSong: boolean) => {
  try {
    const response = await api.patch(statsUrlEndpoint, { guessedSong });

    const { stats }: { stats: Statistics } = response.data;

    return stats;
  } catch (err) {
    console.error("Failed to update user's stats: ", err);
  }
};

export const getLeaderboard = async () => {
  try {
    const response = await api.get(`${statsUrlEndpoint}/all`);

    const { leaderboard }: { leaderboard: LeaderboardStats } = response.data;

    return leaderboard;
  } catch (err) {
    console.error('Failed to get leaderboard stats: ', err);
  }
};
