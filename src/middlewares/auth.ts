import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ERROR_MESSAGE } from '../errors/type';
import { UnauthorizedError } from '../errors/unauthorized';
import { SECRET_KEY } from '../config';

export interface SessionRequest extends Request {
  user?: string | JwtPayload;
}

const extractBearerToken = (header: string) => header.replace('Bearer ', '');

export default (
  req: SessionRequest,
  res: Response,
  next: NextFunction,
) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError(ERROR_MESSAGE.AuthorizationRequired);
  }
  try {
    const token = extractBearerToken(authorization);
    if (SECRET_KEY) {
      const payload = jwt.verify(token, SECRET_KEY);
      req.user = payload;
    }
    next();
  } catch (error) {
    next(error);
  }
  return null;
};
