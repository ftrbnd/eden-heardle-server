import { CustomHeardle, GuessedSong, Statistics, User } from '@prisma/client';

const USERS_ENDPOINT = '/api/users';

export const getUser = async (id: string | undefined) => {
  if (!id) throw new Error('User id is required');

  try {
    const response = await fetch(`${USERS_ENDPOINT}/${id}`, {
      cache: 'no-store'
    });
    if (!response.ok) throw new Error('Failed to get user');

    const { user }: { user: User } = await response.json();
    return user;
  } catch (err) {
    throw new Error('Failed to get user');
  }
};

export const getGuessedSongs = async (userId: string | undefined) => {
  if (!userId) throw new Error('User id is required');

  try {
    const response = await fetch(`${USERS_ENDPOINT}/${userId}/guesses`, {
      cache: 'no-store'
    });
    if (!response.ok) throw new Error('Failed to get guessed songs');

    const { guesses }: { guesses: GuessedSong[] } = await response.json();
    return guesses;
  } catch (err) {
    throw new Error('Failed to get guessed songs');
  }
};

export const updateGuessedSongs = async (guessedSong: GuessedSong, userId: string | undefined) => {
  if (!userId) throw new Error('User id is required');

  try {
    const response = await fetch(`${USERS_ENDPOINT}/${userId}/guesses`, {
      method: 'PATCH',
      body: JSON.stringify({ guessedSong }),
      cache: 'no-store'
    });
    if (!response.ok) throw new Error('Failed to update guesses');

    const { guesses }: { guesses: GuessedSong[] } = await response.json();
    return guesses;
  } catch (err) {
    throw new Error('Failed to update guesses');
  }
};

export const getStats = async (userId: string | undefined) => {
  if (!userId) throw new Error('User id is required');

  try {
    const response = await fetch(`${USERS_ENDPOINT}/${userId}/stats`);
    if (!response.ok) throw new Error('Failed to get stats');

    const { stats }: { stats: Statistics } = await response.json();
    return stats;
  } catch (err) {
    throw new Error('Failed to get stats');
  }
};

export const updateStats = async (guessedSong: boolean, userId: string | undefined) => {
  if (!userId) throw new Error('User id is required');

  try {
    const response = await fetch(`${USERS_ENDPOINT}/${userId}/stats`, {
      method: 'PATCH',
      body: JSON.stringify({ guessedSong: guessedSong }),
      cache: 'no-store'
    });
    if (!response.ok) throw new Error('Failed to update stats');

    const { stats }: { stats: Statistics } = await response.json();
    return stats;
  } catch (err) {
    throw new Error('Failed to update stats');
  }
};

export const getUserCustomHeardle = async (userId: string | undefined) => {
  if (!userId) throw new Error('User id is required');

  try {
    const response = await fetch(`${USERS_ENDPOINT}/${userId}/customHeardle`);
    if (!response.ok) throw new Error('Failed to check if user has a Custom Heardle');

    const { customHeardle }: { customHeardle: CustomHeardle } = await response.json();
    return customHeardle;
  } catch (err) {
    throw new Error('Failed to check if user has a Custom Heardle');
  }
};
