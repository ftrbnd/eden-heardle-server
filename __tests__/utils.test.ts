import ytdl from 'ytdl-core';
import { mockSongs } from '../__mocks__/data';
import { prismaMock } from '../__mocks__/singleton';
import { getRandomSong, getRandomStartTime } from '../src/helpers/heardleGenerators';
import { Heardle } from '../src/utils/logger';

jest.mock('ytdl-core');

describe('Test utility functions', () => {
  describe('setDailySong', () => {
    it('get a random song', async () => {
      prismaMock.song.count.mockResolvedValue(mockSongs.length);
      prismaMock.song.findMany.mockResolvedValue(mockSongs);

      const res = await getRandomSong(Heardle.Daily);

      expect(res).toHaveProperty('album', 'End Credits');
    });

    it('get a random start time', async () => {
      (ytdl.getBasicInfo as jest.Mock).mockImplementation(() => {
        return {
          videoDetails: {
            lengthSeconds: 241
          }
        };
      });

      const startTime = await getRandomStartTime(mockSongs[0], Heardle.Daily);

      expect(startTime).toBeGreaterThanOrEqual(0);
      expect(startTime).toBeLessThanOrEqual(235);
    });
  });

  // TODO: write tests for downladMp3.ts functions
});
