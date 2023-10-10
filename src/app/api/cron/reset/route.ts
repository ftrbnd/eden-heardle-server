import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Supabase dailySong table:
 * id == 0: current daily song
 * id == 1: next daily song
 */
export async function GET(request: NextRequest) {
  try {
    // verify cron job from upstash
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing authorization' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    if (token !== process.env.QSTASH_TOKEN) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }

    // check users' current streaks
    const users = await prisma.user.findMany();
    for (const user of users) {
      const dailyGuesses = await prisma.guesses.findUnique({
        where: {
          userId: user.id
        },
        select: {
          songs: true
        }
      });
      const completedDaily = dailyGuesses?.songs.at(-1)?.correctStatus === 'CORRECT';

      const prevStats = await prisma.statistics.findUnique({
        where: {
          userId: user.id
        }
      });

      if (!completedDaily) {
        await prisma.statistics.update({
          where: {
            userId: user.id
          },
          data: {
            gamesPlayed: prevStats?.gamesPlayed,
            gamesWon: prevStats?.gamesWon,
            currentStreak: 0,
            maxStreak: prevStats?.maxStreak
          }
        });
      }
    }

    // reset all users' guesses
    await prisma.guessedSong.deleteMany({});

    // set saved next daily song to current daily song
    const nextDailySong = await prisma.dailySong.findUnique({
      where: {
        id: '1'
      }
    });
    if (!nextDailySong) return NextResponse.json({ error: 'Error finding next daily song' }, { status: 400 });

    await prisma.dailySong.upsert({
      where: {
        id: '0'
      },
      update: {
        name: nextDailySong.name,
        album: nextDailySong.name,
        cover: nextDailySong.cover,
        link: nextDailySong.link,
        startTime: nextDailySong.startTime,
        heardleDay: nextDailySong.heardleDay
      },
      create: {
        name: nextDailySong.name,
        album: nextDailySong.name,
        cover: nextDailySong.cover,
        link: nextDailySong.link,
        startTime: nextDailySong.startTime,
        heardleDay: nextDailySong.heardleDay
      }
    });

    return NextResponse.json({ message: 'Successfully reset users and set new daily song!' }, { status: 200 });
  } catch (error) {
    console.error('Error setting new daily song: ', error);
    return NextResponse.json({ error: 'Error setting new daily song' }, { status: 500 });
  }
}
