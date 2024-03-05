import express from 'express';
import cors from 'cors';
import { corsOptions } from './utils/corsOptions';
import { heardlesRouter } from './routes/heardles';

const app = express();

app.use(express.json());
app.use(cors(corsOptions));

app.use('/api/heardles', heardlesRouter);
app.use((_req, res) => res.status(404).send({ error: 'Unknown endpoint' }));

export default app;
