import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { registerDailyCronJob } from './lib/cron';

registerDailyCronJob();

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server ready at port ${process.env.PORT || 3001} `);
});
