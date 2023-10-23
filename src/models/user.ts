import mongoose, { Model, Document } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { ERROR_MESSAGE, UnauthorizedError } from '../errors';

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
    validate: {
      validator: (v: string) => validator.isURL(v),
      message: ERROR_MESSAGE.NotValidUrl,
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: ERROR_MESSAGE.NotValidEmail,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

async function findUserByCredentials(
  this: Model<User>,
  email: string,
  password: string,
) {
  const user = await this.findOne({ email }).select('+password')
    .orFail(() => {
      throw new UnauthorizedError(ERROR_MESSAGE.IncorrectEmailOrPassword);
    });
  const matched = await bcrypt.compare(password, user.password);
  if (!matched) {
    throw new UnauthorizedError(ERROR_MESSAGE.IncorrectEmailOrPassword);
  }
  return user;
}

userSchema.static(
  'findUserByCredentials',
  findUserByCredentials,
);

export default mongoose.model<User, UserModel>('user', userSchema);
