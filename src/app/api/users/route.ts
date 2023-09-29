import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const users = (await prisma.user.findMany()).sort((a, b) => parseInt(a.id) - parseInt(b.id));

    return NextResponse.json(users, { status: 200 });
  } catch (err) {
    return NextResponse.json(err, { status: 400 });
  }
}
