import express from 'express';
import { heardlesRouter } from './routes/heardles';
import morgan from 'morgan';
import { utilRouter } from './routes/utils';

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.use('/healthcheck', (_req, res) => {
  res.json({ healthCheck: 'ok' });
});
app.use('/utils', utilRouter);
app.use('/api/heardles', heardlesRouter);
app.use((_req, res) => res.status(404).send({ error: 'Unknown endpoint' }));

export default app;
