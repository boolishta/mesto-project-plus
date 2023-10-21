import express from 'express';
import mongoose from 'mongoose';
import {
  celebrate, errors, Segments, Joi,
} from 'celebrate';
import { errorHandler } from './errors/index';
import { login, createUser } from './controllers/user';
import auth from './middlewares/auth';
import { DB_HOST, PORT } from './config';
import users from './routes/users';
import cards from './routes/cards';
import { requestLogger, errorLogger } from './middlewares/logger';

const app = express();

mongoose.connect(DB_HOST);

app.use(express.json());
app.use(requestLogger);
app.post('/signin', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string(),
    about: Joi.string(),
    avatar: Joi.string(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), createUser);
app.use(auth);
app.use('/users', users);
app.use('/cards', cards);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
