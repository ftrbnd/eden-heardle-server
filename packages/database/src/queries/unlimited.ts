import { Song } from '../../generated/prisma';
import { prisma } from '../client';

interface CreateUnlimitedHeardleParams {
  song: Song;
  id: string;
  signedUrl?: string;
  startTime: number;
}
export async function createUnlimitedHeardle({ song, id, signedUrl, startTime }: CreateUnlimitedHeardleParams) {
  const unlimitedHeardle = await prisma.unlimitedHeardle.create({
    data: {
      id,
      name: song.name,
      album: song.album,
      cover: song.cover,
      link: signedUrl ?? song.link,
      startTime,
      duration: song.duration
    }
  });

  return unlimitedHeardle;
}

export async function getAllUnlimitedHeardles() {
  const unlimitedHeardles = await prisma.unlimitedHeardle.findMany();
  return unlimitedHeardles;
}

export async function deleteUnlimitedHeardle(id: string) {
  await prisma.unlimitedHeardle.delete({
    where: {
      id
    }
  });
}
