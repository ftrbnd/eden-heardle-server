import { DailySong, Statistics, User } from '@prisma/client';
import prisma from '../lib/prisma';
import { Heardle, logger } from './logger';

export async function userGuessedCorrectly(user: User): Promise<boolean> {
  const dailyGuesses = await prisma.guesses.findUnique({
    where: {
      userId: user.id
    },
    select: {
      songs: true
    }
  });

  const guessedCorrectly = dailyGuesses?.songs.at(-1)?.correctStatus === 'CORRECT';
  return guessedCorrectly;
}

export async function updateStatistics(payload: Statistics) {
  return await prisma.statistics.update({
    where: {
      userId: payload.userId
    },
    data: payload
  });
}

async function updateUserStreak(user: User, guessedCorrectly: boolean) {
  if (!guessedCorrectly) {
    const prevStats = await prisma.statistics.findUnique({
      where: {
        userId: user.id
      }
    });
    if (!prevStats) throw new Error("Failed to find this user's statistics");

    const newStats: Statistics = {
      ...prevStats,
      currentStreak: 0
    };

    updateStatistics(newStats);
  }
}

export async function updateAllStreaks() {
  const users = await prisma.user.findMany();
  for (const user of users) {
    const guessedCorrectly = await userGuessedCorrectly(user);
    updateUserStreak(user, guessedCorrectly);
  }
}

export async function resetGuesses() {
  // reset all users' guesses
  return await prisma.guessedSong.deleteMany({});
}

export async function getNextDailySong() {
  const nextDailySong = await prisma.dailySong.findUnique({
    where: {
      id: '1'
    }
  });
  if (!nextDailySong) throw new Error('Error finding next daily song');

  return nextDailySong;
}

export async function updateDailySong(nextDailySong: DailySong) {
  // set saved next daily song to current daily song
  return await prisma.dailySong.upsert({
    where: {
      id: '0'
    },
    update: {
      name: nextDailySong.name,
      album: nextDailySong.album,
      cover: nextDailySong.cover,
      link: nextDailySong.link,
      startTime: nextDailySong.startTime,
      heardleDay: nextDailySong.heardleDay
    },
    create: {
      name: nextDailySong.name,
      album: nextDailySong.album,
      cover: nextDailySong.cover,
      link: nextDailySong.link,
      startTime: nextDailySong.startTime,
      heardleDay: nextDailySong.heardleDay
    }
  });
}

export async function updateDatabase() {
  try {
    logger(Heardle.Daily, 'Updating stats and daily song...');

    await updateAllStreaks();
    await resetGuesses();
    const nextDailySong = await getNextDailySong();
    await updateDailySong(nextDailySong);

    logger(Heardle.Daily, 'DONE');

    return { message: 'Successfully updated users and new daily song!' };
  } catch (error: unknown) {
    logger(Heardle.Daily, "Error updating today's database: ", error);
  }
}
