import mongoose from 'mongoose';
import validator from 'validator';
import { ERROR_MESSAGE } from '../errors';

interface Card {
  likes: mongoose.Schema.Types.ObjectId[]
  name: string
  link: string
  owner: typeof mongoose.Schema.Types.ObjectId
  createdAt: Date
}

const cardSchema = new mongoose.Schema<Card>({
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => validator.isURL(v),
      message: ERROR_MESSAGE.NotValidUrl,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export default mongoose.model<Card>('card', cardSchema);
