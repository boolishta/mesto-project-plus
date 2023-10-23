import { StatusCodeError, StatusCode } from './type';

export class NotValidError extends Error implements StatusCodeError {
  statusCode: StatusCode;

  constructor(message: string) {
    super(message);
    this.statusCode = 400;
  }
}
