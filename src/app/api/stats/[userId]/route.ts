import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = params;

  try {
    const stats = await prisma.statistics.findUnique({
      where: {
        userId
      }
    });
    if (!stats) return NextResponse.json({ error: 'User stats not found' }, { status: 404 });

    return NextResponse.json({ stats }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(err, { status: 400 });
  }
}
