import { CustomHeardle, Song } from '@prisma/client';

const customHeardleApi = process.env.NEXT_PUBLIC_EXPRESS_URL!;

export const createCustomHeardle = async (song: Song, startTime: number, userId: string) => {
  try {
    if (!song || startTime === null || startTime === undefined || !userId) throw new Error('Missing required parameters');

    const response = await fetch(customHeardleApi, {
      method: 'POST',
      body: JSON.stringify({ song, startTime, userId }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://eden-heardle.io'
      },
      mode: 'cors'
    });
    if (!response.ok) throw new Error('Failed to create Custom Heardle');

    const { link }: { link: string } = await response.json();
    return link;
  } catch (err) {
    console.error(err);
  }
};

export const deleteCustomHeardle = async (heardleId: string, userId: string) => {
  try {
    if (!heardleId || !userId) throw new Error('Missing heardleId or userId');

    const response = await fetch(customHeardleApi, {
      method: 'DELETE',
      body: JSON.stringify({ heardleId, userId }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://eden-heardle.io'
      },
      mode: 'cors'
    });
    if (!response.ok) throw new Error('Failed to delete Custom Heardle');

    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getCustomHeardle = async (heardleId: string) => {
  try {
    const response = await fetch(`/api/customHeardles/${heardleId}`);
    if (!response.ok) throw new Error(`Failed to get Custom Heardle #${heardleId}`);

    const { song }: { song: CustomHeardle } = await response.json();
    return song;
  } catch (err) {
    console.error(err);
  }
};

export const checkUserCustomHeardle = async (userId: string) => {
  try {
    const response = await fetch(`/api/customHeardles/user/${userId}`);
    if (!response.ok) throw new Error('Failed to check if user has a Custom Heardle');

    const { song }: { song: CustomHeardle } = await response.json();
    return song;
  } catch (err) {
    console.error(err);
  }
};
