import { Request, Response } from 'express';
import prisma from '../lib/database';

export const dailySongs_get = async (req: Request, res: Response) => {
  const dailySongs = await prisma.dailySong.findMany();
  if (!dailySongs) res.status(404).json({ message: 'No songs found in DailySong table' });

  res.json({ dailySongs });
};
export const currentDailySong_get = async (req: Request, res: Response) => {
  const currentDailySong = await prisma.dailySong.findUnique({
    where: {
      id: '0'
    }
  });
  if (!currentDailySong) res.status(404).json({ message: "Couldn't find current daily song with id 0" });

  res.json({ currentDailySong });
};

export const nextDailySong_get = async (req: Request, res: Response) => {
  const nextDailySong = await prisma.dailySong.findUnique({
    where: {
      id: '1'
    }
  });
  if (!nextDailySong) res.status(404).json({ message: "Couldn't find current daily song with id 1" });

  res.json({ nextDailySong });
};

export const dailySong_download = async (req: Request, res: Response) => {
  res.json({ message: 'GET dailySong/download' });
};
