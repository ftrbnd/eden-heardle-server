import { DailySong, Song } from '@prisma/client';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

export const songsUrlEndpoint = '/songs';

export const getSongs = async () => {
  const response = await api.get<Song[]>(songsUrlEndpoint);
  return response.data;
};

export const getDailySong = async () => {
  const response = await api.get<DailySong>(`${songsUrlEndpoint}/daily`);
  return response.data;
};
