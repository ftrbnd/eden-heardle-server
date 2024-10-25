import { mockSongs } from '../__mocks__/data';
import { prismaMock } from '../__mocks__/singleton';
import { getRandomSong, getRandomStartTime } from '../src/helpers/heardleGenerators';
import { Heardle } from '../src/utils/logger';

describe('Test utility functions', () => {
  describe('setDailySong', () => {
    it('get a random song', async () => {
      prismaMock.song.count.mockResolvedValue(mockSongs.length);
      prismaMock.song.findMany.mockResolvedValue(mockSongs);

      const res = await getRandomSong(Heardle.Daily);

      expect(res).toHaveProperty('album', 'End Credits');
    });

    it('get a random start time', async () => {
      const startTime = await getRandomStartTime(mockSongs[0], Heardle.Daily);

      expect(startTime).toBeGreaterThanOrEqual(0);
      expect(startTime).toBeLessThanOrEqual(mockSongs[0].duration ?? 0 - 6);
    });
  });

  // TODO: write tests for downladMp3.ts functions
});
