import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const song = await prisma.dailySong.findFirst();

    return NextResponse.json({ song }, { status: 200 });
  } catch (err) {
    return NextResponse.json(err, { status: 400 });
  }
}
