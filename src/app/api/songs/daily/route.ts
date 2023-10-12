import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest) {
  try {
    const song = await prisma.dailySong.findUnique({
      where: {
        id: '0'
      }
    });
    if (!song) return NextResponse.json({ error: 'Daily song not found' }, { status: 404 });

    return NextResponse.json({ song }, { status: 200 });
  } catch (err) {
    return NextResponse.json(err, { status: 400 });
  }
}
