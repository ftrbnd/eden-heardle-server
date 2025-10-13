import { Song, UnlimitedHeardle } from '../../generated/prisma';
import { prisma } from '../client';

export async function getAllSongs() {
  const songs = await prisma.song.findMany();
  return songs;
}

export async function getRandomSong(table: 'song' | 'unlimitedHeardle', amount?: number) {
  let count = 0;
  if (table === 'song') count = await prisma.song.count();
  else if (table === 'unlimitedHeardle') count = await prisma.unlimitedHeardle.count();

  if (count === 0) throw new Error('Database has no songs.');

  const skip = Math.floor(Math.random() * count);

  let randomSongs: (Song | UnlimitedHeardle)[] = [];

  if (table === 'song')
    randomSongs = await prisma.song.findMany({
      take: amount ?? 1,
      skip
    });
  else if (table === 'unlimitedHeardle')
    randomSongs = await prisma.unlimitedHeardle.findMany({
      take: amount ?? 1,
      skip
    });

  return randomSongs;
}
