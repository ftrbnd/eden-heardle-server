import { User, GuessedSong, Guesses, Statistics, DailySong, Song, CustomHeardle } from '@packages/database';

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
    id: '2',
    guessListId: 'mock-guesslist',
    name: 'Gravity',
    album: 'End Credits',
    correctStatus: 'WRONG',
    cover: 'https://i1.sndcdn.com/artworks-000123341011-uyahoc-t500x500.jpg',
    duration: 231
  },
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

export const mockGuessesWrong: GuessedSong[] = [
  {
    id: '1',
    guessListId: 'mock-guesslist-wrong',
    name: 'End Credits',
    album: 'End Credits',
    correctStatus: 'WRONG',
    cover: 'https://i1.sndcdn.com/artworks-000125721149-whx70j-t500x500.jpg',
    duration: 241
  },
  {
    id: '2',
    guessListId: 'mock-guesslist-wrong',
    name: 'Gravity',
    album: 'End Credits',
    correctStatus: 'WRONG',
    cover: 'https://i1.sndcdn.com/artworks-000123341011-uyahoc-t500x500.jpg',
    duration: 231
  }
];

export const mockGuessList: Guesses & { songs: GuessedSong[] } = {
  id: 'mock-guesslist',
  userId: '0209',
  songs: mockGuesses
};

export const mockGuessListWrong: Guesses & { songs: GuessedSong[] } = {
  id: 'mock-guesslist-wrong',
  userId: '0209',
  songs: mockGuessesWrong
};

export const mockStatistics: Statistics = {
  id: 'mock-statistics',
  userId: '0209',
  accuracy: 6,
  gamesPlayed: 12,
  gamesWon: 12,
  currentStreak: 12,
  maxStreak: 12,
  firstStreak: 0
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

export const mockCustomHeardle: CustomHeardle = {
  id: 'mock-custom-heardle',
  userId: '0209',
  name: 'forever//over',
  album: 'vertigo',
  cover: 'https://i1.sndcdn.com/artworks-000287371922-scp0d8-t500x500.jpg',
  duration: 343,
  link: 'https://mfovtgsiorxivjjhwtyw.supabase.co/storage/v1/object/sign/custom_heardles/custom_song_tjxl0ewonswi3mg3y08ks8zk.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJjdXN0b21faGVhcmRsZXMvY3VzdG9tX3NvbmdfdGp4bDBld29uc3dpM21nM3kwOGtzOHprLm1wMyIsImlhdCI6MTcwNTA5MDIxNywiZXhwIjoxNzA1MjYzMDE3fQ.K_oYGeJUzoNpzifof3CoO7rmccIHU9GlD2OWp9GYRc8',
  startTime: 209
};
