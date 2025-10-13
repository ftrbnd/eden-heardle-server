import * as db from '@packages/database/queries';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id) return NextResponse.json({ error: 'Custom Heardle id is required' }, { status: 400 });

  try {
    const customHeardle = await db.getCustomHeardle({ where: { id } });
    if (!customHeardle) return NextResponse.json({ error: 'Custom Heardle song not found' }, { status: 404 });

    return NextResponse.json({ customHeardle }, { status: 200 });
  } catch (err) {
    return NextResponse.json(err, { status: 400 });
  }
}
