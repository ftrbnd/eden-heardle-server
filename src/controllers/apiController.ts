import { Request, Response } from 'express';
import { Song } from '@prisma/client';
import { download } from '../lib/crons';

interface CustomHeardleGetRequest {
  song: Song;
  startTime: number;
  userId: string;
  customId: string;
}

export const custom_heardle_create = async (req: Request, res: Response) => {
  const { song, startTime, userId, customId }: CustomHeardleGetRequest = req.body;
  if (!song || startTime === null || startTime === undefined || !userId || !customId) {
    return res.status(400).json({ message: 'No request body' });
  }

  console.log('Incoming Custom Heardle request: ', req.body);

  try {
    await download(song, startTime, userId, customId);

    res.json({ message: 'Custom heardle created!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating custom heardle' });
  }
};

export const custom_heardle_delete = async (req: Request, res: Response) => {
  res.json({ message: 'TODO: Implement delete custom heardle' });
};
