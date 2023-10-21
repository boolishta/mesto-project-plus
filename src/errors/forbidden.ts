import { StatusCodeError, StatusCode } from './index';

export class ForbiddenError extends Error implements StatusCodeError {
  statusCode?: StatusCode;

  constructor(message: string) {
    super(message);
    this.statusCode = 403;
  }
}
