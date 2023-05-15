import * as jwt from 'jsonwebtoken';
import { jwtConfig } from '../config';

/**
 *Generates and returns a JWT token
 * @param payload
 * @returns JWT token
 */
export function generateAccessToken(payload: any) {
  return jwt.sign({ payload }, jwtConfig.JWT_SECRET as jwt.Secret, {
    expiresIn: jwtConfig.JWT_EXPIRY,
  });
}

/**
 * Generates and returns a refresh token
 * @param payload 
 * @returns Refresh token
 */
export function generateRefreshToken(payload: any) {
  return jwt.sign({ payload }, jwtConfig.REFRESH_TOKEN_SECRET as jwt.Secret, {
    expiresIn: jwtConfig.REFRESH_TOKEN_EXPIRY,
  });
}

