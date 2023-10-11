import { Router } from 'express';

const indexRouter = Router();

/* GET home page. */
indexRouter.get('/', (_req, res) => {
  res.json({ title: 'EDEN Heardle Cron Jobs' });
});

export default indexRouter;
