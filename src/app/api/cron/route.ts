import prisma from '@/lib/db';
import { NextResponse } from 'next/server';
import ytdl from 'ytdl-core';

export async function GET() {
  try {
    // get a new random song
    const songsCount = await prisma.song.count();
    const skip = Math.floor(Math.random() * songsCount);
    const randomSongs = await prisma.song.findMany({
      skip: skip,
      take: 1
    });
    const newDailySong = randomSongs[0];
    console.log('New daily song: ', newDailySong);

    // determine the random start time
    const dailySongInfo = await ytdl.getBasicInfo(newDailySong.link);
    const songLength = parseInt(dailySongInfo.videoDetails.lengthSeconds);
    const randomStartTime = Math.floor(Math.random() * songLength) - 7;
    console.log('Random start time: ', randomStartTime);

    // get yesterday's daily song and ensure it exists
    const previousDailySong = await prisma.dailySong.findUnique({
      where: {
        id: '0'
      }
    });
    if (!previousDailySong) return NextResponse.json({ error: "Couldn't find previous daily song" }, { status: 500 });
    if (!previousDailySong.heardleDay) return NextResponse.json({ error: "Couldn't find previous daily song's heardle day number" }, { status: 500 });
    if (!previousDailySong.nextReset) return NextResponse.json({ error: "Couldn't find previous daily song's next reset" }, { status: 500 });

    console.log('Previous daily song: ', previousDailySong);
    // update daily song or create it if it doesn't exist
    await prisma.dailySong.upsert({
      where: {
        id: '0' // replace the same document every time
      },
      update: {
        name: newDailySong.name,
        album: newDailySong.album,
        cover: newDailySong.cover,
        link: newDailySong.link,
        startTime: randomStartTime,
        heardleDay: previousDailySong.heardleDay + 1
        // 'nextReset' field is not needed with a cron job
      },
      create: {
        id: '0',
        name: newDailySong.name,
        album: newDailySong.album,
        cover: newDailySong.cover,
        link: newDailySong.link,
        startTime: randomStartTime,
        heardleDay: previousDailySong.heardleDay + 1
      }
    });

    // check users' current streaks
    const users = await prisma.user.findMany();
    for (const user of users) {
      console.log(`Resetting ${user.name}...`);

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
      console.log('Old stats: ', prevStats);

      if (!completedDaily) {
        const newStats = await prisma.statistics.update({
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
        console.log('New stats: ', newStats);
      }
    }

    // reset all users' guesses
    const deleteGuesses = await prisma.guessedSong.deleteMany({});
    console.log('Deleted guesses: ', deleteGuesses);

    return NextResponse.json({ message: 'Successfully set new daily song!' }, { status: 500 });
  } catch (error) {
    console.error('Error setting new daily song: ', error);
    return NextResponse.json({ error: 'Error setting new daily song' }, { status: 500 });
  }
}
