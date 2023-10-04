import { DailySong, GuessedSong, Song } from '@prisma/client';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

export const songsUrlEndpoint = '/songs';

export const getSongs = async () => {
  const response = await api.get(songsUrlEndpoint);
  const { songs }: { songs: Song[] } = response.data;

  return songs;
};

export const getDailySong = async () => {
  const response = await api.get<DailySong>(`${songsUrlEndpoint}/daily`);
  return response.data;
};

export const getGuessedSongs = async () => {
  const response = await api.get(`${songsUrlEndpoint}/guesses`);

  const { guesses }: { guesses: GuessedSong[] } = response.data;

  return guesses;
};

export const updateGuessedSongs = async (guess: GuessedSong) => {
  const response = await api.patch(`${songsUrlEndpoint}/guesses`, { song: guess });

  const { guesses }: { guesses: GuessedSong[] } = response.data;

  return guesses;
};
