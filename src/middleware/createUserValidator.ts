import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { CustomError } from '../utils/generateError';

const createUserValidator = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const schema = Joi.object({
    username: Joi.string().required(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate({
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
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

export default createUserValidator;
