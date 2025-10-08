import { DailySong, Song, Statistics, UnlimitedHeardle } from '../generated/prisma';
import { prisma } from './client';

// TODO: create separate files for each table
export async function deleteCustomHeardle(heardleId: string, userId: string) {
  await prisma.customHeardle.delete({
    where: { id: heardleId, userId }
  });
}

export async function getDailySong(day: 'previous' | 'next') {
  const song = await prisma.dailySong.findUnique({
    where: {
      id: day === 'previous' ? '0' : day === 'next' ? '1' : undefined
    }
  });

  return song;
}

export async function getDiscordAccount(discordId: string) {
  const account = await prisma.account.findFirst({
    where: {
      providerAccountId: discordId
    }
  });

  return account;
}

interface GetUserParams {
  userId: string;
  includeStatistics?: boolean;
  includeGuesses?: boolean;
}
export async function getUser({ userId, includeGuesses, includeStatistics }: GetUserParams) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    include: {
      statistics: includeStatistics,
      guesses: includeGuesses
    }
  });

  return user;
}

export async function getGuessedSongs(userGuessListId: string) {
  const guessedSongs = await prisma.guessedSong.findMany({
    where: {
      guessListId: userGuessListId
    }
  });

  return guessedSongs;
}

interface GetStatisticsParams {
  includeUsers?: boolean;
}
export async function getStatistics({ includeUsers }: GetStatisticsParams) {
  const allStats = await prisma.statistics.findMany({
    include: {
      user: includeUsers
    }
  });

  return allStats;
}

interface GetUserGuessesParams {
  userId: string;
  includeSongs?: boolean;
  includeUser?: boolean;
}
export async function getUserGuesses({ userId, includeSongs, includeUser }: GetUserGuessesParams) {
  const userGuesses = await prisma.guesses.findUnique({
    where: {
      userId
    },
    select: {
      songs: includeSongs,
      user: includeUser
    }
  });

  return userGuesses;
}

export async function getRandomSong(table: 'song' | 'unlimitedHeardle') {
  let count = 0;
  if (table === 'song') count = await prisma.song.count();
  else if (table === 'unlimitedHeardle') count = await prisma.unlimitedHeardle.count();

  if (count === 0) throw new Error('Database has no songs.');

  const skip = Math.floor(Math.random() * count);

  let randomSongs: (Song | UnlimitedHeardle)[] = [];

  if (table === 'song')
    randomSongs = await prisma.song.findMany({
      take: 1,
      skip
    });
  else if (table === 'unlimitedHeardle')
    randomSongs = await prisma.unlimitedHeardle.findMany({
      take: 1,
      skip
    });

  const randomSong = randomSongs[0];
  return randomSong;
}

interface UpdateDailySongParams {
  song: Song;
  signedUrl?: string;
  startTime: number;
  heardleDay: number;
}
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

export async function getUserCustomHeardle(userId: string) {
  const customHeardle = await prisma.customHeardle.findUnique({
    where: {
      userId
    }
  });

  return customHeardle;
}

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

export async function updateUserStatistics(statistics: Statistics) {
  const stats = await prisma.statistics.update({
    where: {
      userId: statistics.userId
    },
    data: statistics
  });

  return stats;
}

export async function getUserStatistics(userId: string) {
  const stats = await prisma.statistics.findUnique({
    where: {
      userId
    }
  });

  return stats;
}

export async function getAllUsers() {
  const users = await prisma.user.findMany();
  return users;
}

export async function deleteAllGuesses() {
  await prisma.guessedSong.deleteMany();
}

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

export async function deleteFirstCompletedDaily() {
  await prisma.firstCompletedDaily.deleteMany();
}

export async function getAllSongs() {
  const songs = await prisma.song.findMany();
  return songs;
}
