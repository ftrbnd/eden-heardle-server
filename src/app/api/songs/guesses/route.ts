import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { options } from '../../auth/[...nextauth]/options';
import { GuessedSong } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getServerSession(options);
  if (!session) return NextResponse.json(null, { status: 200 });

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id
      },
      select: {
        guesses: {
          select: {
            songs: true
          }
        }
      }
    });
    if (!user) return NextResponse.json({ message: 'Failed to find user' }, { status: 404 });

    return NextResponse.json({ guesses: user.guesses?.songs }, { status: 200 });
  } catch (err) {
    console.log('GET /songs/guesses: ', err);
    return NextResponse.json(err, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(options);
  if (!session) return NextResponse.json(null, { status: 200 });

  try {
    const { song }: { song: GuessedSong } = await req.json();

    const oldGuesses = await prisma.guesses.findUnique({
      where: {
        userId: session.user.id
      },
      include: {
        songs: true
      }
    });
    if (!oldGuesses) return NextResponse.json({ message: "Failed to find user's guesses" }, { status: 404 });
    if (oldGuesses.songs.length === 6) return NextResponse.json({ message: 'Max guess limit (6) reached' }, { status: 403 });

    song.guessListId = oldGuesses.id;

    const updatedGuesses = await prisma.guesses.update({
      where: {
        userId: session.user.id
      },
      data: {
        songs: {
          create: {
            correctStatus: song.correctStatus,
            cover: song.cover,
            name: song.name,
            album: song.album
          }
        }
      },
      include: { songs: true }
    });

    return NextResponse.json({ guesses: updatedGuesses.songs }, { status: 200 });
  } catch (err) {
    console.log('PATCH /songs/guesses: ', err);
    return NextResponse.json(err, { status: 400 });
  }
}
