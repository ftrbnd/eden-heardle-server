import prisma from '../lib/prisma';
import { Heardle, logger } from './logger';

async function updateStats() {
  // check users' current streaks
  const users = await prisma.user.findMany();
  for (const user of users) {
    const dailyGuesses = await prisma.guesses.findUnique({
      where: {
        userId: user.id
      },
      select: {
        songs: true
      }
    });
    const completedDaily = dailyGuesses?.songs.at(-1)?.correctStatus === 'CORRECT';

    const prevStats = await prisma.statistics.findUnique({
      where: {
        userId: user.id
      }
    });

    if (!completedDaily) {
      await prisma.statistics.update({
        where: {
          userId: user.id
        },
        data: {
          gamesPlayed: prevStats?.gamesPlayed,
          gamesWon: prevStats?.gamesWon,
          currentStreak: 0,
          maxStreak: prevStats?.maxStreak
        }
      });
    }
  }
}

async function resetGuesses() {
  // reset all users' guesses
  await prisma.guessedSong.deleteMany({});
}

async function updateDailySong() {
  // set saved next daily song to current daily song
  const nextDailySong = await prisma.dailySong.findUnique({
    where: {
      id: '1'
    }
  });
  if (!nextDailySong) throw new Error('Error finding next daily song');

  await prisma.dailySong.upsert({
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

    await updateStats();
    await resetGuesses();
    await updateDailySong();

    logger(Heardle.Daily, 'DONE');

    return { message: 'Successfully updated users and new daily song!' };
  } catch (error: unknown) {
    logger(Heardle.Daily, "Error updating today's database: ", error);
  }
}
