import { Request, Response } from 'express';
import { Song } from '@prisma/client';
import { download } from '../lib/crons';
import prisma from '../lib/prisma';

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

  console.log('Incoming Custom Heardle POST request: ', req.body);

  try {
    await download(song, startTime, userId, customId);

    res.json({ message: 'Custom heardle created!' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error creating custom heardle' });
  }
};

export const custom_heardle_delete = async (req: Request, res: Response) => {
  const { heardleId } = req.body;
  if (!heardleId) {
    return res.status(400).json({ message: 'Missing custom Heardle id' });
  }

  console.log('Incoming Custom Heardle DELETE request: ', req.body);

  try {
    const deletedHeardle = await prisma.customHeardle.delete({
      where: { id: heardleId }
    });

    res.json({ message: 'Custom heardle deleted!', deletedHeardle });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error deleting custom heardle' });
  }
};
