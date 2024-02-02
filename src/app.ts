import express from 'express';
import dotenv from 'dotenv';
import { customHeardleRouter } from './routes/customHeardle';
import cors from 'cors';
import { whitelist } from './utils/corsOptions';
import { registerDailyCronJob } from './lib/cron';

dotenv.config();

registerDailyCronJob();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  })
);

app.use('/api/customHeardle', customHeardleRouter);
app.use((_req, res) => res.status(404).send({ error: 'Unknown endpoint' }));

export default app;
