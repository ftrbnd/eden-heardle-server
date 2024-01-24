import { CorsOptions } from 'cors';

export const whitelist = process.env.WHITELISTED_DOMAINS ? process.env.WHITELISTED_DOMAINS.split(',') : [];

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
