import { Response } from 'express';
import mongoose from 'mongoose';

export const ERROR_MESSAGE = {
  Validation: 'Ошибка валидации полей',
  Server: 'Ошибка на стороне сервера',
  Client: 'Ошибка на стороне клиента',
  NoCardById: 'Нет карточки по заданному id',
  NotValidId: 'Не валидный id',
};

export const failFindCardById = () => {
  const error = new Error(ERROR_MESSAGE.NoCardById);
  error.name = 'NotFoundError';
  return error;
};

export const sendErrorFindCardById = (
  error: Error | mongoose.Error.CastError | unknown,
  res: Response,
) => {
  if (error instanceof Error && error.name === 'NotFoundError') {
    return res.status(404).send({ message: error.message });
  }
  if (error instanceof mongoose.Error.CastError) {
    return res.status(400).send({ message: ERROR_MESSAGE.NotValidId });
  }

  return res.status(500).send({ message: ERROR_MESSAGE.Server, error });
};
