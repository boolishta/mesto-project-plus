import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { SECRET_KEY } from '../config';
import { handleAuthError } from '../errors';

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
    return handleAuthError(res);
  }
  try {
    const token = extractBearerToken(authorization);
    if (SECRET_KEY) {
      const payload = jwt.verify(token, SECRET_KEY);
      req.user = payload;
    }
    next();
  } catch (error) {
    return handleAuthError(res);
  }
  return null;
};
