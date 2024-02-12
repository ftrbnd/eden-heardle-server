import { Statistics, User } from '@prisma/client';

export interface LocalGuessedSong {
  name: string;
  album?: string;
  cover: string;
  correctStatus: 'CORRECT' | 'ALBUM' | 'WRONG';
}

export interface LocalStatistics {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  accuracy: number;
}

export interface LocalUser {
  guesses: LocalGuessedSong[];
  statistics: LocalStatistics;
  name?: 'anon';
}

export type LocalUserState = {
  statistics: LocalUser['statistics'];
  guesses: LocalUser['guesses'];
  name?: LocalUser['name'];
  updateGuesses: (guess: LocalGuessedSong) => void;
};

/////////////////////////////////////////////////////////

export type GuessType = 'session' | 'local';

/////////////////////////////////////////////////////////

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

export interface LeaderboardStats {
  today: TodayStat[];
  winPercentages: WinPctStat[];
  accuracies: AccuracyStat[];
  currentStreaks: CurStrkStat[];
  maxStreaks: MaxStrkStat[];
}

export type IndividualLeaderboardStat = TodayStat | WinPctStat | AccuracyStat | CurStrkStat | MaxStrkStat;

export type HeardleType = 'DAILY' | 'CUSTOM' | 'UNLIMITED';
