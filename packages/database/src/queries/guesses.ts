import { prisma } from '../client';

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
    select: {
      songs: includeSongs,
      user: includeUser
    }
  });

  return userGuesses;
}

export async function deleteAllGuesses() {
  await prisma.guessedSong.deleteMany();
}
