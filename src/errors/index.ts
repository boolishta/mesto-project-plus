import { Request, Response } from 'express';
import { ForbiddenError } from './forbidden';
import { DuplicateError } from './duplicate';
import { NotFoundError } from './not-found';
import { NotValidError } from './not-valid';
import { ERROR_MESSAGE, StatusCodeError } from './type';
import { UnauthorizedError } from './unauthorized';

const handleAuthError = (res: Response) => {
  res
    .status(401)
    .send({ message: ERROR_MESSAGE.AuthorizationRequired });
};

const errorHandler = (error: StatusCodeError, req: Request, res: Response) => {
  const { statusCode = 500, message } = error;
  return res.status(statusCode).send({
    message: statusCode === 500
      ? ERROR_MESSAGE.Server
      : message,
  });
};

export {
  DuplicateError,
  ForbiddenError,
  NotFoundError,
  NotValidError,
  UnauthorizedError,
  ERROR_MESSAGE,
  handleAuthError,
  errorHandler,
};
