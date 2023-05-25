import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { CustomError } from '../utils/generateError';

const forgotPasswordValidator = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });

  const { error } = schema.validate({
    email: req.body.email,
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

const resetPasswordValidator = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const schema = Joi.object({
    id: Joi.string().required(),
    token: Joi.string().required(),
  });

  const { error } = schema.validate({
    id: req.params.id,
    token: req.params.token,
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

const changeUserPasswordValidator = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const schema = Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
  });

  const { error } = schema.validate({
    oldPassword: req.body.oldPassword,
    newPassword: req.body.newPassword,
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

export {
  forgotPasswordValidator,
  resetPasswordValidator,
  changeUserPasswordValidator,
};
