import { CustomHeardle, Song } from '@prisma/client';

const customHeardleApi = 'http://localhost:3001/api/customHeardle';
// TODO: replace this with the correct external api endpoint

export const createCustomHeardle = async (song: Song, startTime: number, userId: string, customId: string) => {
  try {
    if (!song || startTime === null || startTime === undefined || !userId || !customId) throw new Error('Missing required parameters');

    const response = await fetch(customHeardleApi, {
      method: 'POST',
      body: JSON.stringify({ song, startTime, userId, customId }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:3000'
      },
      mode: 'cors'
    });
    if (!response.ok) throw new Error('Failed to create custom Heardle');

    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getCustomHeardle = async (heardleId: string) => {
  try {
    const response = await fetch(`/api/customHeardles/${heardleId}`);
    if (!response.ok) throw new Error('Failed to create custom Heardle');

    const { song }: { song: CustomHeardle } = await response.json();
    return song;
  } catch (err) {
    console.error(err);
  }
};

export const checkUserCustomHeardle = async (id: string) => {
  try {
    const response = await fetch(`/api/customHeardles/user/${id}`);
    if (!response.ok) throw new Error('Failed to create custom Heardle');

    const { song }: { song: CustomHeardle } = await response.json();
    return song;
  } catch (err) {
    console.error(err);
  }
};
