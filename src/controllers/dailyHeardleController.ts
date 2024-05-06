import { Request, Response } from 'express';
import { Heardle, logger } from '../utils/logger';
import { setDailySong } from '../helpers/heardleGenerators';

// TODO: fix
// Can't reach database server at `aws-0-us-west-1.pooler.supabase.com`:`5432`
// Please make sure your database server is running at `aws-0-us-west-1.pooler.supabase.com`:`5432`.

const retryDailyHeardle = async (req: Request, res: Response) => {
  try {
    logger(Heardle.Daily, 'Retry request received');
    await setDailySong();

    res.json({ message: 'Retried Daily Heardle job' });
  } catch (error: any) {
    logger(Heardle.Daily, error);
    res.status(400).json({ message: 'Failed to run Daily Heardle job', error: error.message });
  }
};

export { retryDailyHeardle };
