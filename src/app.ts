import express from 'express';
import mongoose from 'mongoose';
import users from './routes/users';
import cards from './routes/cards';

const { PORT = 3000 } = process.env;
const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb');

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
