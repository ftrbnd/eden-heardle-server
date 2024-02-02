import { User, GuessedSong, Guesses, Statistics, DailySong, Song } from '@prisma/client';

export const mockSongs: Song[] = [
  {
    id: '1',
    name: 'End Credits',
    album: 'End Credits',
    cover: 'https://i1.sndcdn.com/artworks-000125721149-whx70j-t500x500.jpg',
    duration: 241,
    link: 'https://youtu.be/0pVABElms84'
  },
  {
    id: '2',
    name: 'Gravity',
    album: 'End Credits',
    cover: 'https://i1.sndcdn.com/artworks-000123341011-uyahoc-t500x500.jpg',
    duration: 231,
    link: 'https://youtu.be/f1eMI0d-1Hs'
  }
];

export const mockUser: User = {
  name: 'giosalad',
  earlySupporter: true,
  email: 'giosalas25@gmail.com',
  emailVerified: null,
  id: '0209',
  image: 'https://cdn.discordapp.com/avatars/201917777185865729/da4663a50a0310816ea3f743208dceb8.png'
};

export const mockGuesses: GuessedSong[] = [
  {
    id: '1',
    guessListId: 'mock-guesslist',
    name: 'End Credits',
    album: 'End Credits',
    correctStatus: 'CORRECT',
    cover: 'https://i1.sndcdn.com/artworks-000125721149-whx70j-t500x500.jpg',
    duration: 241
  }
];

export const mockGuessList: Guesses & { songs: GuessedSong[] } = {
  id: 'mock-guesslist',
  userId: '0209',
  songs: mockGuesses
};

export const mockStatistics: Statistics = {
  id: 'mock-statistics',
  userId: '0209',
  accuracy: 6,
  gamesPlayed: 12,
  gamesWon: 12,
  currentStreak: 12,
  maxStreak: 12
};

export const mockCurrentDailySong: DailySong = {
  id: '0',
  name: 'End Credits',
  album: 'End Credits',
  cover: 'https://i1.sndcdn.com/artworks-000125721149-whx70j-t500x500.jpg',
  duration: 241,
  heardleDay: 100,
  link: 'https://youtu.be/0pVABElms84',
  startTime: 10,
  nextReset: null
};

export const mockNextDailySong: DailySong = {
  id: '1',
  name: 'Gravity',
  album: 'End Credits',
  cover: 'https://i1.sndcdn.com/artworks-000123341011-uyahoc-t500x500.jpg',
  duration: 231,
  heardleDay: 101,
  link: 'https://youtu.be/f1eMI0d-1Hs',
  startTime: 24,
  nextReset: null
};
