import { Statistics } from '@prisma/client';
import { prismaMock } from '../__mocks__/singleton';
import { resetGuesses, updateDailySong, updateStatistics } from '../src/utils/updateDatabase';
import { mockNextDailySong, mockStatistics } from '../__mocks__/data';

describe('Test database with prisma mock', () => {
  test("should reset a user's current streak", async () => {
    const newStats: Statistics = {
      ...mockStatistics,
      currentStreak: 0
    };

    prismaMock.statistics.update.mockResolvedValue(newStats);

    await expect(updateStatistics(newStats)).resolves.toEqual({
      id: 'mock-statistics',
      userId: '0209',
      accuracy: 6,
      gamesPlayed: 12,
      gamesWon: 12,
      currentStreak: 0,
      maxStreak: 12
    });
  });

  test('should reset all guesses', async () => {
    prismaMock.guessedSong.delete.mockImplementation();

    await expect(resetGuesses()).resolves.toBeUndefined();
  });

  test('should set the new daily song', async () => {
    const newDailySong = {
      ...mockNextDailySong,
      id: '0'
    };

    prismaMock.dailySong.upsert.mockResolvedValue(newDailySong);

    await expect(updateDailySong(newDailySong)).resolves.toEqual({
      id: '0',
      name: 'Gravity',
      album: 'End Credits',
      cover: 'https://i1.sndcdn.com/artworks-000123341011-uyahoc-t500x500.jpg',
      duration: 231,
      heardleDay: 101,
      link: 'https://youtu.be/f1eMI0d-1Hs',
      startTime: 24,
      nextReset: null
    });
  });

  // TODO: implement test for up downloadMp3.ts/UploadToDatabase
});
