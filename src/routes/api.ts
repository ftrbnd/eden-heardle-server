import { Router } from 'express';
import { custom_heardle_delete, custom_heardle_create } from '../controllers/apiController';
import cors, { CorsOptions } from 'cors';

export const apiRouter = Router();

const whitelist = process.env.WHITELISTED_DOMAINS ? process.env.WHITELISTED_DOMAINS.split(',') : [];

const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['POST', 'DELETE'],
  preflightContinue: true,
  allowedHeaders: ['Content-Type', 'Access-Control-Allow-Origin']
};

apiRouter.get('/', (_req, res) => {
  res.json({ title: 'EDEN Heardle Cron Jobs API' });
});

apiRouter.options('/customHeardle', cors(corsOptions), (req, res, next) => {
  console.log('OPTIONS request received');
  console.log('Request headers: ', req.headers);
  console.log('Request body: ', req.body);

  next();
});

apiRouter.post('/customHeardle', custom_heardle_create);

apiRouter.delete('/customHeardle', custom_heardle_delete);
