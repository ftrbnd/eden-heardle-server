import { CronJob } from 'cron';
import { setDailySong, repeatCreateUnlimitedHeardle } from '../utils/heardleGenerators';

export const registerDailyHeardleCronJob = () => {
  if (process.env.NODE_ENV === 'test') return;

  const cron = new CronJob(`${process.env.DAILY_HEARDLE_CRON_UTC_MINUTE} ${process.env.DAILY_HEARDLE_CRON_UTC_HOUR} * * *`, setDailySong, null, true, 'utc');

  return cron;
};

export const registerUnlimitedHeardleCronJob = () => {
  if (process.env.NODE_ENV === 'test') return;

  const cron = new CronJob(`${process.env.UNLIMITED_HEARDLE_CRON_UTC_MINUTE} ${process.env.UNLIMITED_HEARDLE_CRON_UTC_HOUR} * * *`, () => repeatCreateUnlimitedHeardle(50), null, true, 'utc');

  return cron;
};
