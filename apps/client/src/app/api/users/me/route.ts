import * as db from '@packages/database/queries';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { options } from '../../auth/[...nextauth]/options';

export async function GET() {
  const session = await getServerSession(options);
  if (!session || !session.user.id) return NextResponse.json({ error: 'No user session found' }, { status: 400 });

  try {
    const user = await db.getUser({ userId: session.user.id });
    if (!user) return NextResponse.json({ error: 'You were not found in the database' }, { status: 404 });

    return NextResponse.json({ me: user }, { status: 200 });
  } catch (err) {
    return NextResponse.json(err, { status: 400 });
  }
}
