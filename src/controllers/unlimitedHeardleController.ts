import { Request, Response } from 'express';
import { Heardle, logger } from '../utils/logger';
import prisma from '../lib/prisma';
import { repeatCreateUnlimitedHeardle } from '../helpers/heardleGenerators';

export const getUnlimitedHeardle = async (_req: Request, res: Response) => {
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

// Don't mark as async in order to immediately send response to client
export const retryUnlimitedHeardle = (_req: Request, res: Response) => {
  try {
    logger(Heardle.Unlimited, 'Retry request received');

    repeatCreateUnlimitedHeardle(50);

    res.json({ message: 'Retried Unlimited Heardle job' });
  } catch (error: any) {
    logger(Heardle.Unlimited, error);
    res.status(400).json({ message: 'Failed to run Unlimited Heardle job', error: error.message });
  }
};
