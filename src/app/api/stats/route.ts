import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { options } from '../auth/[...nextauth]/options';
import { Statistics } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getServerSession(options);
  if (!session) return NextResponse.json(null, { status: 200 });

  try {
    const stats = await prisma.statistics.findUnique({
      where: {
        userId: session.user.id
      }
    });
    if (!stats) return NextResponse.json({ message: 'Failed to find user stats' }, { status: 404 });

    return NextResponse.json({ stats }, { status: 200 });
  } catch (err) {
    console.log('GET /stats: ', err);
    return NextResponse.json(err, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(options);
  if (!session) return NextResponse.json(null, { status: 200 });

  try {
    const { guessedSong }: { guessedSong: boolean } = await req.json();

    const oldStats = await prisma.statistics.findUnique({
      where: {
        userId: session.user.id
      }
    });
    if (!oldStats) return NextResponse.json({ message: "Failed to find user's stats" }, { status: 404 });

    const guesses = await prisma.guesses.findUnique({
      where: {
        userId: session.user.id
      },
      include: {
        songs: true
      }
    });

    let gameAccuracy = 0;
    if (guesses?.songs) {
      // find index of first green square
      const greenSquareIndex = guesses.songs.findIndex((guess) => guess.correctStatus === 'CORRECT');

      // calculate accuracy for this game [0,6]
      gameAccuracy = greenSquareIndex === -1 ? 0 : 6 - greenSquareIndex;
    }

    const newStats: Statistics = {
      gamesPlayed: oldStats.gamesPlayed + 1,
      gamesWon: guessedSong ? oldStats.gamesWon + 1 : oldStats.gamesWon,
      currentStreak: guessedSong ? oldStats.currentStreak + 1 : 0,
      maxStreak: Math.max(oldStats.maxStreak, guessedSong ? oldStats.currentStreak + 1 : 0),
      accuracy: oldStats.accuracy + gameAccuracy,
      id: 'fakeid',
      userId: 'fakeuserid'
    };

    const updatedStats = await prisma.statistics.update({
      where: {
        userId: session.user.id
      },
      data: {
        gamesPlayed: newStats.gamesPlayed,
        gamesWon: newStats.gamesWon,
        currentStreak: newStats.currentStreak,
        maxStreak: newStats.maxStreak,
        accuracy: newStats.accuracy
      }
    });

    return NextResponse.json({ stats: updatedStats }, { status: 200 });
  } catch (err) {
    console.log('PATCH /stats: ', err);
    return NextResponse.json(err, { status: 400 });
  }
}
