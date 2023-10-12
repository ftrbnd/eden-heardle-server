import { DailySong, GuessedSong, Song } from '@prisma/client';

const songsUrlEndpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/api/songs`;

export const getSongs = async () => {
  try {
    const response = await fetch(songsUrlEndpoint);
    if (!response.ok) throw new Error('Failed to get songs');

    const { songs }: { songs: Song[] } = await response.json();
    return songs;
  } catch (err) {
    console.error(err);
  }
};

export const getDailySong = async () => {
  try {
    const response = await fetch(`${songsUrlEndpoint}/daily`, {
      cache: 'no-store'
    });
    if (!response.ok) throw new Error('Failed to get daily song');

    const { song }: { song: DailySong } = await response.json();
    return song;
  } catch (err) {
    console.error(err);
  }
};

export const getGuessedSongs = async () => {
  try {
    const response = await fetch(`${songsUrlEndpoint}/guesses`, {
      cache: 'no-store'
    });
    if (!response.ok) throw new Error('Failed to get guessed songs');

    const { guesses }: { guesses: GuessedSong[] } = await response.json();
    if (!guesses) return null;
    return guesses;
  } catch (err) {
    console.error(err);
  }
};

export const updateGuessedSongs = async (guess: GuessedSong) => {
  try {
    const response = await fetch(`${songsUrlEndpoint}/guesses`, {
      method: 'PATCH',
      body: JSON.stringify({ song: guess }),
      cache: 'no-store'
    });
    if (!response.ok) throw new Error('Failed to update guesses');

    const { guesses }: { guesses: GuessedSong[] } = await response.json();

    return guesses;
  } catch (err) {
    console.error(err);
  }
};
