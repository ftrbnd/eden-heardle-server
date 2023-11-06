import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: { heardleId: string } }) {
  const { heardleId } = params;

  try {
    const song = await prisma.customHeardle.findUnique({
      where: {
        id: heardleId
      }
    });
    if (!song) return NextResponse.json({ error: 'Custom heardle song not found' }, { status: 404 });

    return NextResponse.json({ song }, { status: 200 });
  } catch (err) {
    return NextResponse.json(err, { status: 400 });
  }
}
