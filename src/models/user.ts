import mongoose, { Model, Document } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { failFind } from '../errors';

interface User {
  name: string
  about: string
  avatar: string
  email: string
  password: string
}

interface UserModel extends Model<User> {
  // eslint-disable-next-line no-unused-vars
  findUserByCredentials: (email: string, password: string) => Promise<Document<unknown, any, User>>
}

const userSchema = new mongoose.Schema<User, UserModel>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
  },
});

async function findUserByCredentials(
  this: Model<User>,
  email: string,
  password: string,
) {
  const user = await this.findOne({ email }).orFail(() => failFind('IncorrectEmailOrPassword', 'Unauthorized'));
  const matched = await bcrypt.compare(password, user.password);
  return matched ? user : failFind('IncorrectEmailOrPassword', 'Unauthorized');
}

userSchema.static(
  'findUserByCredentials',
  findUserByCredentials,
);

export default mongoose.model<User, UserModel>('user', userSchema);
