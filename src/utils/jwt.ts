import * as jwt from 'jsonwebtoken';
import { jwtConfig } from '../config';

/**
 *
 * @param username
 * @returns JWT token
 */
export function generateAccessToken(payload: any) {
  return jwt.sign({ payload }, jwtConfig.JWT_SECRET as jwt.Secret, {
    expiresIn: jwtConfig.JWT_EXPIRY,
  });
}

export function generateRefreshToken(payload: any) {
  return jwt.sign({ payload }, jwtConfig.REFRESH_TOKEN_SECRET as jwt.Secret, {
    expiresIn: jwtConfig.REFRESH_TOKEN_EXPIRY,
  });
}
