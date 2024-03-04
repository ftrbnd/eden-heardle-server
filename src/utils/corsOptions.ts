import { env } from './env';
import { CorsOptions } from 'cors';

const whitelist = env.WHITELISTED_DOMAINS ? env.WHITELISTED_DOMAINS.split(',') : [];

export const corsOptions: CorsOptions = {
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
