import { Router } from 'express';

export const indexRouter = Router();

/* GET home page. */
indexRouter.get('/', (_req, res) => {
  res.json({ title: 'EDEN Heardle Cron Jobs' });
});
