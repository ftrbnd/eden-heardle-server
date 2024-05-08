import { env } from './env';
import cors, { CorsOptions } from 'cors';
import { RequestHandler } from 'express';

const whitelist = env.WHITELISTED_DOMAINS ? env.WHITELISTED_DOMAINS.split(',') : [];

const options: CorsOptions = {
  origin: function (origin, callback) {
    if (origin && whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['POST', 'DELETE'],
  preflightContinue: true,
  allowedHeaders: ['Content-Type', 'Access-Control-Allow-Origin']
};

export const whitelistCheck = cors(options);

export const tokenExtractor: RequestHandler = (req, res, next) => {
  const authorization = req.get('Authorization');
  if (!authorization) return res.status(403).json({ error: 'Authorization token required' });

  if (!authorization.startsWith('Bearer ')) return res.status(403).json({ error: 'Bearer token required' });

  const token = authorization.replace('Bearer ', '');
  if (token !== env.DISCORD_TOKEN) return res.status(403).json({ error: 'Invalid token' });

  next();
};
