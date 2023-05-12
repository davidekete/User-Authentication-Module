import * as jwt from 'jsonwebtoken';

import { tokenData } from '../config';
import { NextFunction, Request, Response } from 'express';

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).send('Authorization failed. No access token.');
  }

  jwt.verify(token, tokenData.JWT_SECRET as jwt.Secret, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).send('Could not verify token');
    }
    req.user = user;
  });
  next();
}
