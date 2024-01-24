import { Router } from 'express';
import { createCustomHeardle, deleteCustomHeardle } from '../controllers/customHeardleController';
import cors from 'cors';
import { corsOptions } from '../utils/corsOptions';
import { Heardle, logger } from '../utils/logger';

const customHeardleRouter = Router();

customHeardleRouter.get('/', (_req, res) => {
  res.json({ title: '[EDEN] Custom Heardle API' });
});

customHeardleRouter.options('/', cors(corsOptions), (req, _res, next) => {
  logger(Heardle.Custom, 'OPTIONS request received');
  logger(Heardle.Custom, 'Request headers: ', req.headers);
  logger(Heardle.Custom, 'Request body: ', req.body);

  next();
});

customHeardleRouter.post('/', createCustomHeardle);

customHeardleRouter.delete('/', deleteCustomHeardle);

export { customHeardleRouter };
