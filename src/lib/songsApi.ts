import { DailySong, GuessedSong, Song } from '@prisma/client';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

export const songsUrlEndpoint = '/songs';

export const getSongs = async () => {
  try {
    const response = await api.get(songsUrlEndpoint);
    const { songs }: { songs: Song[] } = response.data;

    return songs;
  } catch (err) {
    console.error('Failed to get songs: ', err);
  }
};

export const getDailySong = async () => {
  try {
    const response = await api.get(`${songsUrlEndpoint}/daily`);

    const { song }: { song: DailySong } = response.data;
    return song;
  } catch (err) {
    console.error('Failed to get daily song: ', err);
  }
};

export const getGuessedSongs = async () => {
  try {
    const response = await api.get(`${songsUrlEndpoint}/guesses`);
    if (!response.data) return null;

    const { guesses }: { guesses: GuessedSong[] } = response.data;

    return guesses;
  } catch (err) {
    console.error("Failed to get user's guessed songs: ', err");
  }
};

export const updateGuessedSongs = async (guess: GuessedSong) => {
  try {
    const response = await api.patch(`${songsUrlEndpoint}/guesses`, { song: guess });

    const { guesses }: { guesses: GuessedSong[] } = response.data;

    return guesses;
  } catch (err) {
    console.error("Failed to update user's guessed songs: ", err);
  }
};
