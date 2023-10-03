import { Statistics } from '@prisma/client';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

export const statsUrlEndpoint = '/stats';

export const getStats = async () => {
  const response = await api.get(statsUrlEndpoint);

  const { stats }: { stats: Statistics } = response.data;

  return stats;
};

export const updateStats = async (guessedSong: boolean) => {
  const response = await api.patch(statsUrlEndpoint, { guessedSong });

  const { stats }: { stats: Statistics } = response.data;

  return stats;
};
