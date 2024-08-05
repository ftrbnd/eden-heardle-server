import { Request, Response } from 'express';
import { Heardle, logger } from '../utils/logger';
import { setDailySong } from '../helpers/heardleGenerators';
import prisma from '../lib/prisma';
import { GuessedSong } from '@prisma/client';
import { LeaderboardStats } from '../utils/schema';
import { announcementSchema, redis } from '../lib/redis';

// Don't mark as async in order to immediately send response to client
export const retryDailyHeardle = (_req: Request, res: Response) => {
  try {
    logger(Heardle.Daily, 'Retry request received');

    setDailySong();

    res.json({ message: 'Retried Daily Heardle job' });
  } catch (error: any) {
    logger(Heardle.Daily, error);
    res.status(400).json({ message: 'Failed to run Daily Heardle job', error: error.message });
  }
};

export const getDailySong = async (_req: Request, res: Response) => {
  try {
    const song = await prisma.dailySong.findUnique({
      where: {
        id: '0'
      }
    });

    res.json({ song });
  } catch (error: any) {
    logger(Heardle.Daily, error);
    res.status(400).json({ message: 'Failed to get current Daily Song', error: error.message });
  }
};

export const getUserStatistics = async (req: Request, res: Response) => {
  try {
    const discordId = req.params.userId;

    const account = await prisma.account.findFirst({
      where: {
        providerAccountId: discordId
      }
    });
    if (!account) {
      return res.json({ error: 'Discord account not found' }).status(404);
    }

    const user = await prisma.user.findUnique({
      where: {
        id: account.userId
      },
      include: {
        statistics: true,
        guesses: true
      }
    });
    if (!user) {
      return res.json({ error: 'User not found' }).status(404);
    }
    if (!user.guesses) {
      return res.json({ error: 'User has not guessed a song yet' }).status(404);
    }
    if (!user.statistics) {
      return res.json({ error: 'User has no statistics yet' }).status(404);
    }

    const guessedSongs = await prisma.guessedSong.findMany({
      where: {
        guessListId: user.guesses.id
      }
    });

    res.json({ guesses: guessedSongs, statistics: user.statistics });
  } catch (error: any) {
    logger(Heardle.Daily, error);
    res.status(400).json({ message: 'Failed to get user statistics', error: error.message });
  }
};

const guessStatuses = (songs: GuessedSong[]): string[] => {
  const statuses: string[] = [];

  for (const song of songs) {
    statuses.push(song.correctStatus);
  }

  return statuses;
};

export const getLeaderboard = async (_req: Request, res: Response) => {
  try {
    const allStats = await prisma.statistics.findMany({
      include: {
        user: true
      }
    });
    if (!allStats) return res.json({ error: 'Failed to find leaderboard stats' }).status(404);

    const leaderboard: LeaderboardStats = {
      today: [],
      winPercentages: [],
      accuracies: [],
      currentStreaks: [],
      maxStreaks: []
    };

    for (const userStat of allStats) {
      const userGuesses = await prisma.guesses.findUnique({
        where: {
          userId: userStat.userId
        },
        select: {
          songs: true,
          user: true
        }
      });

      if (!userGuesses) return res.json({ error: 'Failed to find user guesses from userStat' }).status(404);

      // daily stats
      if (userGuesses.songs.length === 6 || userGuesses.songs.at(-1)?.correctStatus === 'CORRECT') {
        leaderboard.today.push({
          data: guessStatuses(userGuesses.songs),
          user: userGuesses.user,
          type: 'Today'
        });
      }

      // win percentages and accuracies (minimum of 2 games played)
      if (userStat.gamesPlayed >= 2) {
        leaderboard.winPercentages.push({
          data: Math.round(((userStat?.gamesWon ?? 0) / (userStat?.gamesPlayed || 1)) * 100),
          user: userGuesses.user,
          type: 'WinPct'
        });

        leaderboard.accuracies.push({
          data: Math.round(((userStat.accuracy ?? 0) / (userStat.gamesPlayed * 6)) * 100),
          user: userGuesses.user,
          type: 'Accuracy'
        });
      }

      // current streaks (streaks start at 2)
      if (userStat.currentStreak >= 2) {
        leaderboard.currentStreaks.push({
          data: userStat.currentStreak,
          user: userGuesses.user,
          type: 'CurStrk'
        });
      }

      // max streaks
      if (userStat.maxStreak >= 2) {
        leaderboard.maxStreaks.push({
          data: userStat.maxStreak,
          user: userGuesses.user,
          type: 'MaxStrk'
        });
      }
    }

    leaderboard.today.sort((a, b) => {
      const aIndex = a.data.indexOf('CORRECT');
      const bIndex = b.data.indexOf('CORRECT');

      return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex); // if they didn't get the song, 'CORRECT' is not in any of their GuessedSongs, so return any number greater than 6 instead of -1
    });
    leaderboard.winPercentages.sort((a, b) => b.data - a.data);
    leaderboard.accuracies.sort((a, b) => b.data - a.data);
    leaderboard.currentStreaks.sort((a, b) => b.data - a.data);
    leaderboard.maxStreaks.sort((a, b) => b.data - a.data);

    res.json({ leaderboard });
  } catch (error: any) {
    logger(Heardle.Daily, error);
    res.status(400).json({ message: 'Failed to get leaderboard', error: error.message });
  }
};

export const setAnnouncement = async (req: Request, res: Response) => {
  try {
    const announcement = announcementSchema.parse(req.body.announcement);

    await redis.set('show_banner', announcement.showBanner ? 'true' : 'false');
    await redis.set('text', announcement.text);
    await redis.set('link', announcement.link ?? '');
    await redis.set('status', announcement.status);

    res.json({ announcement });
  } catch (error: any) {
    logger(Heardle.Daily, error);
    res.status(400).json({ message: 'Failed to get leaderboard', error: error.message });
  }
};
