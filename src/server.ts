import { env } from './utils/env';

import app from './app';
import { registerDailyHeardleCronJob, registerUnlimitedHeardleCronJob } from './lib/cron';

registerDailyHeardleCronJob();
registerUnlimitedHeardleCronJob();

app.listen(env.PORT, () => {
  console.log(`Server ready at port ${env.PORT} `);
});
