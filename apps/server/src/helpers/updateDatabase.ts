import { DailySong, Statistics, User } from '@packages/database';
import * as db from '@packages/database/queries';
import { Heardle, logger } from '../utils/logger';

export async function userGuessedCorrectly(user: User): Promise<boolean> {
  const dailyGuesses = await db.getUserGuesses({
    userId: user.id,
    includeSongs: true
  });
  if (!dailyGuesses) throw new Error("Failed to find this user's guesses");

  const guessedCorrectly = dailyGuesses.songs.some((guess) => guess.correctStatus === 'CORRECT');
  return guessedCorrectly;
}

export async function updateStatistics(payload: Statistics) {
  const newStats = await db.updateUserStatistics(payload);
  return newStats;
}

async function updateUserStreak(user: User, guessedCorrectly: boolean) {
  if (!guessedCorrectly) {
    const prevStats = await db.getUserStatistics(user.id);
    if (!prevStats) throw new Error("Failed to find this user's statistics");

    const newStats: Statistics = {
      ...prevStats,
      currentStreak: 0
    };

    updateStatistics(newStats);
  }
}

export async function updateAllStreaks() {
  const users = await db.getAllUsers();
  for (const user of users) {
    const guessedCorrectly = await userGuessedCorrectly(user);
    updateUserStreak(user, guessedCorrectly);
  }
}

export async function resetGuesses() {
  // reset all users' guesses
  await db.deleteAllGuesses();
}

export async function getNextDailySong() {
  const nextDailySong = await db.getDailySong('next');
  if (!nextDailySong) throw new Error('Error finding next daily song');

  return nextDailySong;
}

export async function updateDailySong(nextDailySong: Omit<DailySong, 'id'>) {
  // set saved next daily song to current daily song
  const newDailySong = await db.setDailySong(nextDailySong);
  return newDailySong;
}

export async function resetFirstCompletedDaily() {
  await db.deleteFirstCompletedDaily();
}

export async function updateDatabase() {
  try {
    logger(Heardle.Daily, 'Updating stats and daily song...');

    await updateAllStreaks();
    await resetGuesses();
    await resetFirstCompletedDaily();
    const nextDailySong = await getNextDailySong();
    await updateDailySong(nextDailySong);

    logger(Heardle.Daily, 'DONE');

    return { message: 'Successfully updated users and new daily song!' };
  } catch (error: unknown) {
    logger(Heardle.Daily, "Error updating today's database: ", error);
    throw new Error("Error updating today's database");
  }
}
