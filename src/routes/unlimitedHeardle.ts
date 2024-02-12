import { Router } from 'express';
import { getUnlimitedHeardle } from '../controllers/unlimitedHeardleController';

const unlimitedHeardleRouter = Router();

unlimitedHeardleRouter.get('/', getUnlimitedHeardle);

export { unlimitedHeardleRouter };
