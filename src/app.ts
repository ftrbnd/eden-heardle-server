import express from 'express';
import dotenv from 'dotenv';
import { CronJob } from 'cron';
import { download, reset } from './lib/crons';

dotenv.config();

const app = express();

app.use(express.json());

app.use('/', (_req, res) => {
  res.json({ title: 'EDEN Heardle Cron Jobs' });
});
app.use((_req, res) => {
  res.status(404).json({ message: 'Route does not exist' });
});

const job = new CronJob(`${process.env.CRON_UTC_MINUTE} ${process.env.CRON_UTC_HOUR} * * *`, download, null, true, 'utc');

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server ready at port ${process.env.PORT || 3001} `);
});
