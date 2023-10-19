import express from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import { errorHandler } from './errors/index';
import { login, createUser } from './controllers/user';
import auth from './middlewares/auth';
import { DB_HOST, PORT } from './config';
import users from './routes/users';
import cards from './routes/cards';

const app = express();

mongoose.connect(DB_HOST);

app.use(express.json());
app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/users', users);
app.use('/cards', cards);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
