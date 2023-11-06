import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const song = await prisma.customHeardle.findUnique({
      where: {
        userId: id
      }
    });

    return NextResponse.json({ song }, { status: 200 });
  } catch (err) {
    return NextResponse.json(err, { status: 400 });
  }
}
