import { User } from '@prisma/client';

export type GuessType = 'session' | 'local';

export interface TodayStat {
  data: string[];
  user: User;
  type: 'Today';
}

export interface WinPctStat {
  data: number;
  user: User;
  type: 'WinPct';
}

export interface AccuracyStat {
  data: number;
  user: User;
  type: 'Accuracy';
}

export interface CurStrkStat {
  data: number;
  user: User;
  type: 'CurStrk';
}

export interface MaxStrkStat {
  data: number;
  user: User;
  type: 'MaxStrk';
}

export type LeaderboardStat = TodayStat | WinPctStat | AccuracyStat | CurStrkStat | MaxStrkStat;
