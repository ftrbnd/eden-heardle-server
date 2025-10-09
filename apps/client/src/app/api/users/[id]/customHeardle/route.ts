import prisma from '@/utils/db';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const userId = params.id;
  if (!userId) return NextResponse.json({ error: 'User id is required' }, { status: 400 });

  try {
    const customHeardle = await prisma.customHeardle.findUnique({
      where: {
        userId
      }
    });

    return NextResponse.json({ customHeardle }, { status: 200 });
  } catch (err) {
    return NextResponse.json(err, { status: 400 });
  }
}
