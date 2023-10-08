import express from 'express';
import mongoose from 'mongoose';
import users from './routes/users';

const { PORT = 3000 } = process.env;
const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb');
app.use(express.json());
app.use('/users', users);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
