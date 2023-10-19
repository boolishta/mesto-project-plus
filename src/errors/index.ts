import { Request, Response } from 'express';
import mongoose from 'mongoose';

export const ERROR_MESSAGE = {
  Validation: 'Ошибка валидации полей',
  Server: 'На сервере произошла ошибка.',
  Client: 'Ошибка на стороне клиента',
  NoCardById: 'Нет карточки по заданному id',
  NotValidId: 'Не валидный id',
  NoUserById: 'Нет пользователя по заданному id',
  IncorrectEmailOrPassword: 'Неправильные почта или пароль',
  AuthorizationRequired: 'Необходима авторизация',
};

export const ERROR_NAME = {
  NotFoundError: 'NotFoundError',
  Unauthorized: 'Unauthorized',
};

export type StatusCode = 404 | 401

export interface StatusCodeError extends Error {
  statusCode?: StatusCode
}

type ErrorMessageKey = keyof typeof ERROR_MESSAGE;
type ErrorNameKey = keyof typeof ERROR_NAME

export const failFind = (
  errorMessage: ErrorMessageKey,
  errorName: ErrorNameKey = 'NotFoundError',
) => {
  const error = new Error(ERROR_MESSAGE[errorMessage]);
  error.name = ERROR_NAME[errorName];
  return error;
};

export const sendError = (
  error: Error | mongoose.Error.CastError | unknown,
  res: Response,
) => {
  if (error instanceof Error && error.name === ERROR_NAME.NotFoundError) {
    return res.status(404).send({ message: error.message });
  }

  if (error instanceof Error && error.name === ERROR_NAME.Unauthorized) {
    return res.status(401).send({ massage: error.message });
  }

  if (error instanceof mongoose.Error.CastError) {
    return res.status(400).send({ message: ERROR_MESSAGE.NotValidId });
  }

  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(400).send({ message: ERROR_MESSAGE.Validation });
  }

  return res.status(500).send({ message: ERROR_MESSAGE.Server });
};

export const handleAuthError = (res: Response) => {
  res
    .status(401)
    .send({ message: ERROR_MESSAGE.AuthorizationRequired });
};

// TODO: create handle errors
export const errorHandler = (error: StatusCodeError, req: Request, res: Response) => {
  const { statusCode = 500, message } = error;
  return res.status(statusCode).send({
    message: statusCode === 500
      ? ERROR_MESSAGE.Server
      : message,
  });
};
