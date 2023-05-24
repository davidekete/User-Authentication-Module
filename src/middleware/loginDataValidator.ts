import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

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
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};
