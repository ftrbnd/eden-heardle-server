import { Song, Prisma } from '../../generated/prisma';
import { prisma } from '../client';

interface CreateCustomHeardleParams {
  song: Song;
  id: string;
  userId: string;
  signedUrl?: string;
  startTime: number;
}
export async function createCustomHeardle({ song, id, userId, signedUrl, startTime }: CreateCustomHeardleParams) {
  const customHeardle = await prisma.customHeardle.create({
    data: {
      id,
      userId,
      name: song.name,
      album: song.album,
      cover: song.cover,
      link: signedUrl ?? song.link,
      startTime: startTime,
      duration: song.duration
    }
  });

  return customHeardle;
}

interface GetCustomHeardleParams {
  where: Prisma.CustomHeardleWhereUniqueInput;
  includeUser?: boolean;
}
export async function getCustomHeardle({ where, includeUser }: GetCustomHeardleParams) {
  const customHeardle = await prisma.customHeardle.findUnique({
    where,
    include: {
      User: includeUser
    }
  });

  return customHeardle;
}

export async function getUserCustomHeardle(userId: string) {
  const customHeardle = await prisma.customHeardle.findUnique({
    where: {
      userId
    }
  });

  return customHeardle;
}

export async function deleteCustomHeardle(heardleId: string, userId: string) {
  await prisma.customHeardle.delete({
    where: { id: heardleId, userId }
  });
}
