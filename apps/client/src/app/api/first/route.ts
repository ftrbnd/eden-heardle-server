import * as db from '@packages/database/queries';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const first = await db.getFirstCompletedDaily();
    if (!first) return NextResponse.json({ error: 'Failed to find FirstCompletedDaily' }, { status: 404 });

    return NextResponse.json({ first }, { status: 200 });
  } catch (err) {
    return NextResponse.json(err, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId }: { userId: string } = await req.json();
    const firstAlreadyCompleted = await db.getFirstCompletedDaily();

    if (firstAlreadyCompleted) {
      await db.updateUserStatistics({
        userId,
        firstStreak: 0
      });

      return NextResponse.json({ first: firstAlreadyCompleted }, { status: 200 });
    }

    const today = db.createFirstCompletedDaily(userId);

    const prevStats = await db.getUserStatistics(userId);
    if (!prevStats) return NextResponse.json({ error: 'Stats not found' }, { status: 404 });

    await db.updateUserStatistics({
      userId,
      firstStreak: prevStats.firstStreak + 1
    });

    return NextResponse.json({ first: today }, { status: 200 });
  } catch (err) {
    return NextResponse.json(err, { status: 400 });
  }
}
