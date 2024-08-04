import { Router } from 'express';
import { createCustomHeardle, deleteCustomHeardle } from '../controllers/customHeardleController';
import { getUnlimitedHeardle } from '../controllers/unlimitedHeardleController';
import { getDailySong, getLeaderboard, getUserStatistics, retryDailyHeardle } from '../controllers/dailyHeardleController';
import { tokenExtractor, whitelistCheck } from '../utils/middleware';

const heardlesRouter = Router();

heardlesRouter.get('/', (_req, res) => {
  res.json({ title: 'EDEN Heardle API' });
});

heardlesRouter.get('/daily/retry', tokenExtractor, retryDailyHeardle);

heardlesRouter.get('/daily', tokenExtractor, getDailySong);

heardlesRouter.get('/statistics/:userId', getUserStatistics);

heardlesRouter.get('/leaderboard', getLeaderboard);

heardlesRouter.options('/custom', whitelistCheck);

heardlesRouter.post('/custom', whitelistCheck, createCustomHeardle);

heardlesRouter.delete('/custom', whitelistCheck, deleteCustomHeardle);

heardlesRouter.get('/unlimited', whitelistCheck, getUnlimitedHeardle);

export { heardlesRouter };
