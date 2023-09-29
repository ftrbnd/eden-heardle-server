import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET({ params }: { params: { id: string } }) {
  try {
    const song = await prisma.user.findUnique({
      where: {
        id: params.id
      }
    });

    return NextResponse.json(song, { status: 200 });
  } catch (err) {
    return NextResponse.json(err, { status: 400 });
  }
}
