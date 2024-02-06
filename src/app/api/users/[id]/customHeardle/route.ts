import prisma from '@/utils/db';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const userId = params.id;

  try {
    const song = await prisma.customHeardle.findUnique({
      where: {
        userId
      }
    });

    return NextResponse.json({ song }, { status: 200 });
  } catch (err) {
    return NextResponse.json(err, { status: 400 });
  }
}
