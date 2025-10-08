import { env } from '../utils/env';
import { CronJob } from 'cron';
import { setDailySong, repeatCreateUnlimitedHeardle } from '../helpers/heardleGenerators';

export const registerDailyHeardleCronJob = () => {
  const environment = env.NODE_ENV;
  if (environment === 'test') return;

  const devMinuteFrequency = env.DAILY_HEARDLE_DEV_MINUTE_FREQUENCY;

  const time = environment === 'development' ? `*/${devMinuteFrequency} * * * *` : `${env.DAILY_HEARDLE_CRON_UTC_MINUTE} ${env.DAILY_HEARDLE_CRON_UTC_HOUR} * * *`;
  console.log(`[${environment.toUpperCase()}] environment cron time: ${time}`);
  const cron = new CronJob(time, setDailySong, null, true, 'utc');

  return cron;
};

export const registerUnlimitedHeardleCronJob = () => {
  if (process.env.NODE_ENV === 'test') return;

  const cron = new CronJob(`${env.UNLIMITED_HEARDLE_CRON_UTC_MINUTE} ${env.UNLIMITED_HEARDLE_CRON_UTC_HOUR} * * *`, () => repeatCreateUnlimitedHeardle(50), null, true, 'utc');

  return cron;
};
