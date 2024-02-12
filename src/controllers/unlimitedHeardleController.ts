import { Request, Response } from 'express';
import { Heardle, logger } from '../utils/logger';
import prisma from '../lib/prisma';

const getUnlimitedHeardle = async (_req: Request, res: Response) => {
  try {
    const count = await prisma.unlimitedHeardle.count();
    const skip = Math.floor(Math.random() * count);
    const randomSongs = await prisma.unlimitedHeardle.findMany({
      take: 1,
      skip
    });
    const unlimitedHeardle = randomSongs[0];

    res.json({ unlimitedHeardle });
  } catch (error: any) {
    logger(Heardle.Unlimited, error);
    res.status(400).json({ message: 'Failed to create Unlimited Heardle', error: error.message });
  }
};

export { getUnlimitedHeardle };
