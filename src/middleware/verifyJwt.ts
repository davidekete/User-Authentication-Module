import * as jwt from 'jsonwebtoken';

import { jwtConfig } from '../config';
import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../utils/generateError';

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw new CustomError(
      'NO_TOKEN',
      401,
      'Authorization failed. No access token.'
    );
  }

  jwt.verify(token, jwtConfig.JWT_SECRET as jwt.Secret, (err, user) => {
    if (err) {
      console.log(err);
      throw new CustomError('INVALID_TOKEN');
    }
    //@ts-expect-error
    req.user = user;
  });
  next();
}
