import express from 'express';
import dotenv from 'dotenv';
import { CronJob } from 'cron';
import { setDailySong } from './lib/crons';
import { apiRouter } from './routes/api';
import { indexRouter } from './routes';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000'
  })
);

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use((_req, res) => res.status(404).json({ message: 'Route does not exist' }));

const job = new CronJob(`${process.env.CRON_UTC_MINUTE} ${process.env.CRON_UTC_HOUR} * * *`, setDailySong, null, true, 'utc');

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server ready at port ${process.env.PORT || 3001} `);
});
