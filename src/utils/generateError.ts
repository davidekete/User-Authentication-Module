import { NextFunction, Request, Response } from 'express';
import { errorCodesObject } from './errorCodes';
export class CustomError extends Error {
  errData;
  customStatusCode;
  customErrorMessage;

  constructor(
    errData: keyof typeof errorCodesObject,
    customStatusCode?: number,
    customErrorMessage?: string
  ) {
    super();
    this.errData = errData;
    this.customStatusCode = customStatusCode;
    this.customErrorMessage = customErrorMessage;
  }
}

export const handleError = function (
  errorObj: any,
  res: Response,
  req: Request,
  next: NextFunction
) {
  const code: keyof typeof errorCodesObject = errorObj.code
    ? errorObj.code
    : null;
  const error = errorCodesObject[code] || errorCodesObject['INTERNAL_ERROR'];
  const statusCode = errorObj.customStatusCode
    ? errorObj.customStatusCode
    : error.statusCode;

  const message = errorObj.customErrorMessage
    ? errorObj.customErrorMessage
    : error.message;

  return res.status(statusCode).json({ message });
};
