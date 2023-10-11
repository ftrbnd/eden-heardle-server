import express from 'express';
import dotenv from 'dotenv';
import indexRouter from './routes';
import apiRouter from './routes/api';

dotenv.config();

const app = express();

app.use(express.json());

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use((_req, res) => {
  res.status(404).json({ message: 'Route does not exist' });
});
app.listen(process.env.PORT || 3001, () => {
  console.log(`Server ready at port ${process.env.PORT || 3001} `);
});
