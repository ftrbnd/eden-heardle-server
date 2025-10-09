import { Statistics } from '../../generated/prisma';
import { prisma } from '../client';

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
