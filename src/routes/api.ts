import { Router } from 'express';
import { dailySong_download, currentDailySong_get, nextDailySong_get, dailySongs_get } from '../controllers/dailySongController';

const apiRouter = Router();

apiRouter.get('/', (_req, res) => {
  res.json({ title: 'EDEN Heardle Cron Jobs API' });
});

apiRouter.get('/dailySong', dailySongs_get);

apiRouter.get('/dailySong/current', currentDailySong_get);

apiRouter.get('/dailySong/next', nextDailySong_get);

apiRouter.get('/dailySong/download', dailySong_download);

export default apiRouter;
