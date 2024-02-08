import prisma from '@/utils/db';
import { LeaderboardStats } from '@/utils/types';
import { GuessedSong } from '@prisma/client';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function guessStatuses(songs: GuessedSong[]): string[] {
  const statuses: string[] = [];

  for (const song of songs) {
    statuses.push(song.correctStatus);
  }

  return statuses;
}

export async function GET() {
  try {
    const allStats = await prisma.statistics.findMany({
      include: {
        user: true
      }
    });
    if (!allStats) return NextResponse.json({ error: 'Failed to find leaderboard stats' }, { status: 404 });

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

      if (!userGuesses) return NextResponse.json({ error: 'Failed to find user guesses from userStat' }, { status: 404 });

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

    return NextResponse.json({ leaderboard }, { status: 200 });
  } catch (err) {
    return NextResponse.json(err, { status: 400 });
  }
}
