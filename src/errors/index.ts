import { Request, Response } from 'express';
import { ForbiddenError } from './forbidden';
import { DuplicateError } from './duplicate';
import { NotFoundError } from './not-found';
import { BadRequestError } from './bad-request';
import { ERROR_MESSAGE, StatusCodeError } from './type';
import { UnauthorizedError } from './unauthorized';

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
  BadRequestError,
  UnauthorizedError,
  ERROR_MESSAGE,
  errorHandler,
};
