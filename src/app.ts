import express from 'express';
import cors from 'cors';
import { corsOptions } from './utils/corsOptions';
import { customHeardleRouter } from './routes/customHeardle';

const app = express();

app.use(express.json());
app.use(cors(corsOptions));

app.use('/api/customHeardle', customHeardleRouter);
app.use((_req, res) => res.status(404).send({ error: 'Unknown endpoint' }));

export default app;
