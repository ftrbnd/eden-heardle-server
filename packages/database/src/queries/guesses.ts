import { GuessedSong } from '../../generated/prisma';
import { prisma } from '../client';

export async function createDefaultUserGuesses(userId: string) {
  await prisma.guesses.create({
    data: {
      userId
    }
  });
}

export async function getGuessedSongs(userGuessListId: string) {
  const guessedSongs = await prisma.guessedSong.findMany({
    where: {
      guessListId: userGuessListId
    }
  });

  return guessedSongs;
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
    include: {
      songs: includeSongs,
      user: includeUser
    }
  });

  return userGuesses;
}

export async function addUserGuess(userId: string, song: GuessedSong) {
  const updatedGuesses = await prisma.guesses.update({
    where: {
      userId
    },
    data: {
      songs: {
        create: {
          correctStatus: song.correctStatus,
          cover: song.cover,
          name: song.name,
          album: song.album
        }
      }
    },
    include: { songs: true }
  });

  return updatedGuesses;
}

export async function deleteAllGuesses() {
  await prisma.guessedSong.deleteMany();
}
