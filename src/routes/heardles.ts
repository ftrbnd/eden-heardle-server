import { Router } from 'express';
import { createCustomHeardle, deleteCustomHeardle } from '../controllers/customHeardleController';
import { getUnlimitedHeardle } from '../controllers/unlimitedHeardleController';

const heardlesRouter = Router();

heardlesRouter.get('/', (_req, res) => {
  res.json({ title: 'EDEN Heardle API' });
});

heardlesRouter.post('/custom', createCustomHeardle);

heardlesRouter.delete('/custom', deleteCustomHeardle);

heardlesRouter.get('/unlimited', getUnlimitedHeardle);

export { heardlesRouter };
