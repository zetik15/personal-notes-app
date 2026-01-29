import express, { json } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { usersRouter, notesRouter, authRouter } from './routes';

import { sleep } from './sleep.js';

const server = express();

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

server.use(json(), cookieParser(), cors({
  origin: true,
  credentials: true
}), sleep([400, 1500]));

server.use('/api/users', usersRouter);

server.use('/api/notes', notesRouter);

server.use('/api', authRouter);
