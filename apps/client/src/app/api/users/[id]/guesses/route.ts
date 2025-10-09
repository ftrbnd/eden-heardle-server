import * as db from '@packages/database/queries';
import { NextRequest, NextResponse } from 'next/server';
import { GuessedSong } from '@packages/database';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  if (!id) return NextResponse.json({ error: 'User id is required' }, { status: 400 });

  try {
    const guesses = await db.getUserGuesses({ userId: id, includeSongs: true });

    if (!guesses) return NextResponse.json({ error: 'Failed to find user guesses' }, { status: 404 });

    return NextResponse.json({ guesses: guesses.songs }, { status: 200 });
  } catch (err) {
    return NextResponse.json(err, { status: 400 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = params.id;
  if (!userId) return NextResponse.json({ error: 'User id is required' }, { status: 400 });

  try {
    const { guessedSong }: { guessedSong: GuessedSong } = await req.json();

    const oldGuesses = await db.getUserGuesses({ userId, includeSongs: true });
    if (!oldGuesses) return NextResponse.json({ error: "Failed to find user's guesses" }, { status: 404 });
    if (oldGuesses.songs.length === 6) return NextResponse.json({ error: 'Max guess limit (6) reached' }, { status: 403 });

    guessedSong.guessListId = oldGuesses.id;

    const updatedGuesses = await db.addUserGuess(userId, guessedSong);

    return NextResponse.json({ guesses: updatedGuesses.songs }, { status: 200 });
  } catch (err) {
    return NextResponse.json(err, { status: 400 });
  }
}
