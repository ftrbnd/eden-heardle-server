import { Statistics } from '@prisma/client';
import { prismaMock } from '../__mocks__/singleton';
import { getNextDailySong, resetGuesses, updateAllStreaks, updateDailySong, updateStatistics, userGuessedCorrectly } from '../src/helpers/updateDatabase';
import { mockGuessList, mockGuessListWrong, mockNextDailySong, mockStatistics, mockUser } from '../__mocks__/data';

describe('Test database interactions with Prisma mock', () => {
  it('confirm that a user correctly guessed the Daily Heardle', async () => {
    prismaMock.guesses.findUnique.mockResolvedValue(mockGuessList);

    const guessedCorrectly = await userGuessedCorrectly(mockUser);
    expect(guessedCorrectly).toBeTruthy();
  });

  it('confirm that a user failed to  guess the Daily Heardle', async () => {
    prismaMock.guesses.findUnique.mockResolvedValue(mockGuessListWrong);

    const guessedCorrectly = await userGuessedCorrectly(mockUser);
    expect(guessedCorrectly).toBeFalsy();
  });

  it("should reset a user's current streak", async () => {
    const newStats: Statistics = {
      ...mockStatistics,
      currentStreak: 0
    };

    prismaMock.statistics.update.mockResolvedValue(newStats);
    const resolvedStats = await updateStatistics(newStats);

    expect(resolvedStats).toEqual({
      id: 'mock-statistics',
      userId: '0209',
      accuracy: 6,
      gamesPlayed: 12,
      gamesWon: 12,
      currentStreak: 0,
      maxStreak: 12,
      firstStreak: 0
    });
  });

  it('should update all streaks', async () => {
    prismaMock.user.findMany.mockResolvedValue([mockUser, mockUser, mockUser]);
    const mockGuesses = prismaMock.guesses.findUnique.mockResolvedValueOnce(mockGuessList).mockResolvedValueOnce(mockGuessListWrong).mockResolvedValueOnce(mockGuessList);
    prismaMock.statistics.findUnique.mockResolvedValue(mockStatistics);
    const mockUpdate = prismaMock.statistics.update
      .mockResolvedValueOnce(mockStatistics)
      .mockResolvedValueOnce({ ...mockStatistics, currentStreak: 0 })
      .mockResolvedValueOnce(mockStatistics);

    await updateAllStreaks();

    expect(mockGuesses.mock.calls).toHaveLength(3);
    expect(mockUpdate.mock.calls).toHaveLength(1); // only one users's streak had to be updated since only the middle user didn't correctly guess the Daily hEARDLE
  });

  it('should reset all guesses', async () => {
    prismaMock.guessedSong.delete.mockImplementation();
    const response = await resetGuesses();

    expect(response).toBeUndefined();
  });

  it('should get the next daily song', async () => {
    prismaMock.dailySong.findUnique.mockResolvedValue(mockNextDailySong);

    const newDailySong = await getNextDailySong();

    expect(newDailySong).toHaveProperty('name', 'Gravity');
  });

  it('should update the new daily song', async () => {
    const newDailySong = {
      ...mockNextDailySong,
      id: '0'
    };

    prismaMock.dailySong.upsert.mockResolvedValue(newDailySong);
    const resolvedSong = await updateDailySong(newDailySong);

    expect(resolvedSong).toEqual({
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
});
