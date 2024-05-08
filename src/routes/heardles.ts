import { Router } from 'express';
import { createCustomHeardle, deleteCustomHeardle } from '../controllers/customHeardleController';
import { getUnlimitedHeardle } from '../controllers/unlimitedHeardleController';
import { retryDailyHeardle } from '../controllers/dailyHeardleController';
import { tokenExtractor, whitelistCheck } from '../utils/middleware';

const heardlesRouter = Router();

heardlesRouter.get('/', (_req, res) => {
  res.json({ title: 'EDEN Heardle API' });
});

heardlesRouter.get('/daily', tokenExtractor, retryDailyHeardle);

heardlesRouter.post('/custom', whitelistCheck, createCustomHeardle);

heardlesRouter.delete('/custom', whitelistCheck, deleteCustomHeardle);

heardlesRouter.get('/unlimited', whitelistCheck, getUnlimitedHeardle);

export { heardlesRouter };
