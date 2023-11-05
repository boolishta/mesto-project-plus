import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ERROR_MESSAGE } from '../errors/type';
import { UnauthorizedError } from '../errors/unauthorized';
import { SECRET_KEY } from '../config';

export interface SessionRequest extends Request {
  user: JwtPayload;
}

const extractBearerToken = (header: string) => header.replace('Bearer ', '');

export default (
  req: SessionRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedError(ERROR_MESSAGE.Server);
    }
    const token = extractBearerToken(authorization);
    req.user = jwt.verify(token, SECRET_KEY) as JwtPayload;
    next();
  } catch (error) {
    next(new UnauthorizedError(ERROR_MESSAGE.AuthorizationRequired));
  }
};
