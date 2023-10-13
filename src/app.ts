import express from 'express';
import mongoose from 'mongoose';
import { DB_HOST, PORT } from './config';
import users from './routes/users';
import cards from './routes/cards';

const app = express();

mongoose.connect(DB_HOST);

app.use(express.json());
app.use((req, res, next) => {
  // @ts-ignore
  req.user = {
    _id: '651fb119fec1469f34d579b2',
  };

  next();
});
app.use('/users', users);
app.use('/cards', cards);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
