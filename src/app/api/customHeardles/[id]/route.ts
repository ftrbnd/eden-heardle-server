import prisma from '@/utils/db';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id) throw new Error('Missing the Custom Heardle id');

  try {
    const song = await prisma.customHeardle.findUnique({
      where: {
        id
      }
    });
    if (!song) return NextResponse.json({ error: 'Custom heardle song not found' }, { status: 404 });

    return NextResponse.json({ song }, { status: 200 });
  } catch (err) {
    return NextResponse.json(err, { status: 400 });
  }
}
