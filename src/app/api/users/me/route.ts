import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { options } from '../../auth/[...nextauth]/options';

export async function GET() {
  const session = await getServerSession(options);

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session?.user.id
      }
    });

    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    return NextResponse.json(err, { status: 400 });
  }
}
