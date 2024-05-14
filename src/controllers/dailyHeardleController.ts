import { Request, Response } from 'express';
import { Heardle, logger } from '../utils/logger';
import { setDailySong } from '../helpers/heardleGenerators';

const retryDailyHeardle = (_req: Request, res: Response) => {
  try {
    logger(Heardle.Daily, 'Retry request received');

    setDailySong();

    res.json({ message: 'Retried Daily Heardle job' });
  } catch (error: any) {
    logger(Heardle.Daily, error);
    res.status(400).json({ message: 'Failed to run Daily Heardle job', error: error.message });
  }
};

export { retryDailyHeardle };
