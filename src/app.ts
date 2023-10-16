import express from 'express';
import mongoose from 'mongoose';
import { login } from './controllers/auth';
import auth from './middlewares/auth';
import { DB_HOST, PORT } from './config';
import users from './routes/users';
import cards from './routes/cards';

const app = express();

mongoose.connect(DB_HOST);

app.use(express.json());
app.post('/signin', login);
app.use(auth);
app.use('/users', users);
app.use('/cards', cards);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
