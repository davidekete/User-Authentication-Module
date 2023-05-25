import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { CustomError } from '../utils/generateError';

const loginDataValidator = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const schema = Joi.object({
    emailOrUsername: Joi.string().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate({
    emailOrUsername: req.body.emailOrUsername,
    password: req.body.password,
  });

 if (error) {
    throw new CustomError(
      'VALIDATION_ERROR',
      undefined,
      error.details[0].message
    );
  }

  next();
};

export default loginDataValidator;
