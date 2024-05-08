import express from 'express';
import { heardlesRouter } from './routes/heardles';

const app = express();

app.use(express.json());

app.use('/healthcheck', (_req, res) => {
  res.json({ healthCheck: 'ok' });
});
app.use('/api/heardles', heardlesRouter);
app.use((_req, res) => res.status(404).send({ error: 'Unknown endpoint' }));

export default app;
