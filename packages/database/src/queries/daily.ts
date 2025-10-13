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
export async function setDailySong(song: Omit<DailySong, 'id'>) {
  const newDailySong = await prisma.dailySong.upsert({
    where: {
      id: '0'
    },
    update: song,
    create: song
  });

  return newDailySong;
}

export async function getDailySong(day: 'current' | 'next') {
  const song = await prisma.dailySong.findUnique({
    where: {
      id: day === 'next' ? '1' : '0'
    },
    omit: {
      id: true
    }
  });

  return song;
}

export async function createFirstCompletedDaily(userId: string) {
  const firstCompletedDaily = await prisma.firstCompletedDaily.create({
    data: {
      userId
    },
    include: {
      user: {
        include: {
          statistics: true
        }
      }
    }
  });

  return firstCompletedDaily;
}

export async function getFirstCompletedDaily() {
  const first = await prisma.firstCompletedDaily.findFirst({
    include: {
      user: {
        include: {
          statistics: true
        }
      }
    }
  });

  return first;
}

export async function deleteFirstCompletedDaily() {
  await prisma.firstCompletedDaily.deleteMany();
}
