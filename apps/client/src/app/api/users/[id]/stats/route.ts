import * as db from '@packages/database/queries';
import { Statistics } from '@packages/database';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const userId = params.id;
  if (!userId) return NextResponse.json({ error: 'User id is required' }, { status: 400 });

  try {
    const stats = await db.getUserStatistics(userId);
    if (!stats) return NextResponse.json({ error: 'Failed to find user stats' }, { status: 404 });

    return NextResponse.json({ stats }, { status: 200 });
  } catch (err) {
    return NextResponse.json(err, { status: 400 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = params.id;
  if (!userId) return NextResponse.json({ error: 'User id is required' }, { status: 400 });

  try {
    const { guessedSong }: { guessedSong: boolean } = await req.json();

    const oldStats = await db.getUserStatistics(userId);
    if (!oldStats) return NextResponse.json({ error: "Failed to find user's stats" }, { status: 404 });

    const guesses = await db.getUserGuesses({ userId, includeSongs: true });
    if (!guesses) return NextResponse.json({ error: "Failed to find user's guesses" }, { status: 404 });

    let gameAccuracy = 0;
    // find index of first green square
    const greenSquareIndex = guesses.songs.findIndex((guess) => guess.correctStatus === 'CORRECT');

    // calculate accuracy for this game [0,6]
    gameAccuracy = greenSquareIndex === -1 ? 0 : 6 - greenSquareIndex;

    const updatedStats = await db.updateUserStatistics(userId, {
      gamesPlayed: oldStats.gamesPlayed + 1,
      gamesWon: guessedSong ? oldStats.gamesWon + 1 : oldStats.gamesWon,
      currentStreak: guessedSong ? oldStats.currentStreak + 1 : 0,
      maxStreak: Math.max(oldStats.maxStreak, guessedSong ? oldStats.currentStreak + 1 : 0),
      accuracy: oldStats.accuracy + gameAccuracy
    });

    return NextResponse.json({ stats: updatedStats }, { status: 200 });
  } catch (err) {
    return NextResponse.json(err, { status: 400 });
  }
}
