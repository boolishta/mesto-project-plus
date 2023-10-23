import express from 'express';
import mongoose from 'mongoose';
import {
  celebrate, errors,
} from 'celebrate';
import { ERROR_MESSAGE } from './errors/type';
import { errorHandler, NotFoundError } from './errors';
import { login, createUser } from './controllers/user';
import auth, { SessionRequest } from './middlewares/auth';
import { DB_HOST, PORT } from './config';
import users from './routes/users';
import cards from './routes/cards';
import { requestLogger, errorLogger } from './middlewares/logger';
import { VALIDATION_OPTIONS } from './validation';

const app = express();

mongoose.connect(DB_HOST);

app.use(express.json());
app.use(requestLogger);
app.post('/signin', celebrate(VALIDATION_OPTIONS.SIGNIN), login);
app.post('/signup', celebrate(VALIDATION_OPTIONS.SIGNUP), createUser);
app.use((req, res, next) => {
  auth(req as SessionRequest, res, next);
});
app.use('/users', users);
app.use('/cards', cards);
app.use(() => {
  throw new NotFoundError(ERROR_MESSAGE.PageNotFound);
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
