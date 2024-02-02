import { Router } from 'express';
import { createCustomHeardle, deleteCustomHeardle } from '../controllers/customHeardleController';

const customHeardleRouter = Router();

customHeardleRouter.get('/', (_req, res) => {
  res.json({ title: '[EDEN] Custom Heardle API' });
});

customHeardleRouter.post('/', createCustomHeardle);

customHeardleRouter.delete('/', deleteCustomHeardle);

export { customHeardleRouter };
