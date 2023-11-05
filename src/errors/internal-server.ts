import { StatusCodeError, StatusCode } from './type';

export class InternalServerError extends Error implements StatusCodeError {
  statusCode: StatusCode;

  constructor(message: string) {
    super(message);
    this.statusCode = 500;
  }
}
