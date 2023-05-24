import { NextFunction, Request, Response } from 'express';
import { errorCodesObject } from './errorCodes';
export class CustomError extends Error {
  errData: any;

  constructor(errData: any) {
    super();
    this.errData = errData;
  }
}

export const generateError = function (
  errorObj: any,
  res: Response,
  req: Request,
  next: NextFunction
) {
  const code: keyof typeof errorCodesObject = errorObj.code
    ? errorObj.code
    : null;
  const error = errorCodesObject[code] || errorCodesObject['INTERNAL_ERROR'];

  return res.status(error.statusCode).json({ message: error.message });
};
