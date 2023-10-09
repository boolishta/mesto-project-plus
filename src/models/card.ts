import mongoose from 'mongoose';

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
