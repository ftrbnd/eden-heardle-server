import { Router } from 'express';
import { createCustomHeardle, deleteCustomHeardle } from '../controllers/customHeardleController';
import { getUnlimitedHeardle, retryUnlimitedHeardle } from '../controllers/unlimitedHeardleController';
import { getDailySong, getLeaderboard, getUserStatistics, retryDailyHeardle, setAnnouncement } from '../controllers/dailyHeardleController';
import { tokenExtractor, whitelistCheck } from '../utils/middleware';

const heardlesRouter = Router();

heardlesRouter.get('/', (_req, res) => {
  res.json({ title: 'EDEN Heardle API' });
});

// FROM DISCORD BOT:
heardlesRouter.get('/daily/retry', tokenExtractor, retryDailyHeardle);

heardlesRouter.get('/daily', tokenExtractor, getDailySong);

heardlesRouter.get('/unlimited/retry', tokenExtractor, retryUnlimitedHeardle);

heardlesRouter.get('/statistics/:userId', tokenExtractor, getUserStatistics);

heardlesRouter.get('/leaderboard', tokenExtractor, getLeaderboard);

heardlesRouter.patch('/announcement', tokenExtractor, setAnnouncement);

// FROM HEARDLE CLIENT:
heardlesRouter.options('/custom', whitelistCheck);

heardlesRouter.post('/custom', whitelistCheck, createCustomHeardle);

heardlesRouter.delete('/custom', whitelistCheck, deleteCustomHeardle);

heardlesRouter.get('/unlimited', whitelistCheck, getUnlimitedHeardle);

export { heardlesRouter };
