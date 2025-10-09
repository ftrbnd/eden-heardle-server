import { prisma } from '../client';

export async function getAllUsers() {
  const users = await prisma.user.findMany();
  return users;
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

export async function getDiscordAccount(discordId: string) {
  const account = await prisma.account.findFirst({
    where: {
      providerAccountId: discordId
    }
  });

  return account;
}
