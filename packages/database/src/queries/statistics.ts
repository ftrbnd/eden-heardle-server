import { Statistics } from '../../generated/prisma';
import { prisma } from '../client';

export async function createDefaultUserStatistics(userId: string) {
  await prisma.statistics.create({
    data: {
      userId,
      currentStreak: 0,
      maxStreak: 0,
      gamesPlayed: 0,
      gamesWon: 0,
      accuracy: 0,
      firstStreak: 0
    }
  });
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

export async function getUserStatistics(userId: string) {
  const stats = await prisma.statistics.findUnique({
    where: {
      userId
    }
  });

  return stats;
}

export async function updateUserStatistics(statistics: Partial<Statistics>) {
  const stats = await prisma.statistics.update({
    where: {
      userId: statistics.userId
    },
    data: statistics
  });

  return stats;
}
