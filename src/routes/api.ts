import { Router } from 'express';
import { currentDailySong_get, nextDailySong_get, dailySongs_get } from '../controllers/dailySongController';
import { dailySong_download, dailySong_reset, verify_qstash } from '../controllers/cronController';

const apiRouter = Router();

apiRouter.get('/', (_req, res) => {
  res.json({ title: 'EDEN Heardle Cron Jobs API' });
});

apiRouter.get('/dailySong', dailySongs_get);

apiRouter.get('/dailySong/current', currentDailySong_get);

apiRouter.get('/dailySong/next', nextDailySong_get);

// CRON JOBS BELOW

apiRouter.get('/dailySong/download', verify_qstash, dailySong_download);

apiRouter.get('/dailySong/reset', verify_qstash, dailySong_reset);

export default apiRouter;
