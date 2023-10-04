import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const limit = req.nextUrl.searchParams.get('limit');

  try {
    let songs;
    if (limit) {
      const songsCount = await prisma.song.count();
      const skip = Math.floor(Math.random() * songsCount);

      songs = await prisma.song.findMany({
        skip: skip,
        take: parseInt(limit)
      });
    } else {
      songs = await prisma.song.findMany();
    }

    const sortedSongs = songs.sort((a, b) => parseInt(a.id) - parseInt(b.id));

    return NextResponse.json({ songs: sortedSongs }, { status: 200 });
  } catch (err) {
    return NextResponse.json(err, { status: 400 });
  }
}
