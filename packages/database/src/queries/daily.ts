import { DailySong, Song } from '../../generated/prisma';
import { prisma } from '../client';

interface UpdateDailySongParams {
  song: Song;
  signedUrl?: string;
  startTime: number;
  heardleDay: number;
}
/** Prepares the new daily song in the database with id "1", but doesn't set it */
export async function updateDailySong({ song, signedUrl, startTime, heardleDay }: UpdateDailySongParams) {
  await prisma.dailySong.upsert({
    where: {
      id: '1'
    },
    update: {
      name: song.name,
      album: song.album,
      cover: song.cover,
      link: signedUrl,
      startTime: startTime,
      heardleDay
      // 'nextReset' field is not needed with a cron job
    },
    create: {
      id: '1',
      name: song.name,
      album: song.album,
      cover: song.cover,
      link: signedUrl ?? song.link,
      startTime: startTime,
      heardleDay
    }
  });
}

/** Sets the new daily song by upserting at id "0" */
export async function setDailySong(song: DailySong) {
  const newDailySong = await prisma.dailySong.upsert({
    where: {
      id: '0'
    },
    update: song,
    create: song
  });

  return newDailySong;
}

export async function getDailySong(day: 'previous' | 'next') {
  const song = await prisma.dailySong.findUnique({
    where: {
      id: day === 'previous' ? '0' : day === 'next' ? '1' : undefined
    }
  });

  return song;
}

export async function deleteFirstCompletedDaily() {
  await prisma.firstCompletedDaily.deleteMany();
}
