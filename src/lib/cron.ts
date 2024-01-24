import { CronJob } from 'cron';
import { setDailySong } from '../utils/setDailySong';

export const registerDailyCronJob = () => {
  const dailyCronJob = new CronJob(`${process.env.CRON_UTC_MINUTE} ${process.env.CRON_UTC_HOUR} * * *`, setDailySong, null, true, 'utc');

  return dailyCronJob;
};
