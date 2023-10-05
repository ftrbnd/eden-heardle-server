import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const songs = await prisma.song.findMany();

    const sortedSongs = songs.sort((a, b) => parseInt(a.id) - parseInt(b.id));

    return NextResponse.json({ songs: sortedSongs }, { status: 200 });
  } catch (err) {
    return NextResponse.json(err, { status: 400 });
  }
}
