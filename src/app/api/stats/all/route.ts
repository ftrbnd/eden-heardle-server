import prisma from '@/lib/db';
import { GuessedSong, User } from '@prisma/client';
import { NextResponse } from 'next/server';

interface TodayStat {
  data: string;
  user: User;
}

interface WinPctStat {
  data: number;
  user: User;
}

interface CurStrkStat {
  data: number;
  user: User;
}

interface MaxStrkStat {
  data: number;
  user: User;
}

export interface LeaderboardStats {
  today: TodayStat[];
  winPercentages: WinPctStat[];
  currentStreaks: CurStrkStat[];
  maxStreaks: MaxStrkStat[];
}

function statusSquares(guesses: GuessedSong[]): string {
  function getStatusSquare(status: string) {
    switch (status) {
      case 'CORRECT':
        return '🟩';
      case 'ALBUM':
        return '🟧';
      case 'WRONG':
        return '🟥';
      default:
        return '⬜';
    }
  }

  let squares: string[] = [];
  guesses?.forEach((guess) => {
    squares.push(getStatusSquare(guess.correctStatus));
  });

  return squares.join('');
}

export async function GET() {
  try {
    const allStats = await prisma.statistics.findMany({
      include: {
        user: true
      }
    });
    if (!allStats) return NextResponse.json({ message: 'Failed to find leaderboard stats' }, { status: 404 });

    const leaderboard: LeaderboardStats = {
      today: [],
      winPercentages: [],
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

      if (!userGuesses) return NextResponse.json({ message: 'Failed to find user guesses from userStat' }, { status: 404 });

      // daily stats
      if (userGuesses.songs.length === 6 || userGuesses.songs.at(-1)?.correctStatus === 'CORRECT') {
        leaderboard.today.push({
          data: statusSquares(userGuesses.songs),
          user: userGuesses.user
        });
      }

      // win percentages
      if (userStat.gamesPlayed > 0) {
        leaderboard.winPercentages.push({
          data: Math.round(((userStat?.gamesWon ?? 0) / (userStat?.gamesPlayed || 1)) * 100),
          user: userGuesses.user
        });
      }

      // current streaks
      if (userStat.currentStreak > 0) {
        leaderboard.currentStreaks.push({
          data: userStat.currentStreak,
          user: userGuesses.user
        });
      }

      // max streaks
      if (userStat.maxStreak > 0) {
        leaderboard.maxStreaks.push({
          data: userStat.maxStreak,
          user: userGuesses.user
        });
      }
    }

    leaderboard.today.sort((a, b) => {
      const aIndex = a.data.indexOf('CORRECT');
      const bIndex = b.data.indexOf('CORRECT');

      return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex); // if they didn't get the song, 'CORRECT' is not in any of their GuessedSongs, so return any number greater than 6 instead of -1
    });
    leaderboard.winPercentages.sort((a, b) => b.data - a.data);
    leaderboard.currentStreaks.sort((a, b) => b.data - a.data);
    leaderboard.maxStreaks.sort((a, b) => b.data - a.data);

    return NextResponse.json({ leaderboard }, { status: 200 });
  } catch (err) {
    console.log('GET /stats: ', err);
    return NextResponse.json(err, { status: 400 });
  }
}
