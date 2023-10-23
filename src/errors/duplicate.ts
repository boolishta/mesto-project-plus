import { StatusCode, StatusCodeError } from './type';

export class DuplicateError extends Error implements StatusCodeError {
  statusCode: StatusCode;

  constructor(message: string) {
    super(message);
    this.statusCode = 409;
  }
}
