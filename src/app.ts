import express from 'express';
import dotenv from 'dotenv';
import indexRouter from './routes';
import apiRouter from './routes/api';

dotenv.config();

const app = express();

app.use(express.json());

app.use('/', indexRouter);
app.use('/api', apiRouter);

const server = app.listen(3001, () =>
  console.log(`
🚀 Server ready at: http://localhost:3001`)
);
