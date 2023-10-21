import { StatusCodeError, StatusCode } from './type';

export class UnauthorizedError extends Error implements StatusCodeError {
  statusCode?: StatusCode;

  constructor(message: string) {
    super(message);
    this.statusCode = 401;
  }
}
