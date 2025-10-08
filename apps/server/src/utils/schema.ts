import { z } from 'zod';
import { Song, User } from '@prisma/client';

export const postSchema = z.object({
  song: z.custom<Song>(),
  startTime: z.coerce.number(),
  userId: z.string()
});

export const deleteSchema = z.object({
  heardleId: z.string(),
  userId: z.string()
});

interface TodayStat {
  data: string[];
  user: User;
  type: 'Today';
}

interface WinPctStat {
  data: number;
  user: User;
  type: 'WinPct';
}

interface AccuracyStat {
  data: number;
  user: User;
  type: 'Accuracy';
}

interface CurStrkStat {
  data: number;
  user: User;
  type: 'CurStrk';
}

interface MaxStrkStat {
  data: number;
  user: User;
  type: 'MaxStrk';
}
export interface LeaderboardStats {
  today: TodayStat[];
  winPercentages: WinPctStat[];
  accuracies: AccuracyStat[];
  currentStreaks: CurStrkStat[];
  maxStreaks: MaxStrkStat[];
}
