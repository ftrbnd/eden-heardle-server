import { DailySong, Song } from '@prisma/client';

const songsUrlEndpoint = '/api/songs';

export const getSongs = async () => {
  try {
    const response = await fetch(songsUrlEndpoint);
    if (!response.ok) throw new Error('Failed to get songs collection');

    const { songs }: { songs: Song[] } = await response.json();
    return songs;
  } catch (err) {
    throw new Error('Failed to get songs collection');
  }
};

export const getDailySong = async () => {
  try {
    const response = await fetch(`${songsUrlEndpoint}/daily`, {
      cache: 'no-store'
    });
    if (!response.ok) throw new Error('Failed to get daily song');

    const { dailySong }: { dailySong: DailySong } = await response.json();
    return dailySong;
  } catch (err) {
    throw new Error('Failed to get daily song');
  }
};
