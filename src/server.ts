import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { registerDailyHeardleCronJob, registerUnlimitedHeardleCronJob } from './lib/cron';

registerDailyHeardleCronJob();
registerUnlimitedHeardleCronJob();

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server ready at port ${process.env.PORT || 3001} `);
});
