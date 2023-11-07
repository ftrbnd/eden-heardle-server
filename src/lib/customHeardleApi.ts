import { CustomHeardle, Song } from '@prisma/client';

const customHeardleApi = 'http://localhost:3001/api/customHeardle';
// TODO: replace this with production api endpoint

export const createCustomHeardle = async (song: Song, startTime: number, userId: string, customId: string) => {
  try {
    if (!song || startTime === null || startTime === undefined || !userId || !customId) throw new Error('Missing required parameters');

    const response = await fetch(customHeardleApi, {
      method: 'POST',
      body: JSON.stringify({ song, startTime, userId, customId }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:3000' // TODO: replace with production url
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

export const deleteCustomHeardle = async (heardleId: string) => {
  try {
    if (!heardleId) throw new Error('Missing custom Heardle id');

    const response = await fetch(customHeardleApi, {
      method: 'DELETE',
      body: JSON.stringify({ heardleId }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:3000' // TODO: replace with production url
      },
      mode: 'cors'
    });
    if (!response.ok) throw new Error('Failed to delete custom Heardle');

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

export const checkUserCustomHeardle = async (userId: string) => {
  try {
    const response = await fetch(`/api/customHeardles/user/${userId}`);
    if (!response.ok) throw new Error('Failed to create custom Heardle');

    const { song }: { song: CustomHeardle } = await response.json();
    return song;
  } catch (err) {
    console.error(err);
  }
};
