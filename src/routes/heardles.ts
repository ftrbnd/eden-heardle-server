import { Router } from 'express';
import { createCustomHeardle, deleteCustomHeardle } from '../controllers/customHeardleController';
import { getUnlimitedHeardle } from '../controllers/unlimitedHeardleController';
import { retryDailyHeardle } from '../controllers/dailyHeardleController';

const heardlesRouter = Router();

heardlesRouter.get('/', (_req, res) => {
  res.json({ title: 'EDEN Heardle API' });
});

heardlesRouter.get('/daily', retryDailyHeardle);

heardlesRouter.post('/custom', createCustomHeardle);

heardlesRouter.delete('/custom', deleteCustomHeardle);

heardlesRouter.get('/unlimited', getUnlimitedHeardle);

export { heardlesRouter };
