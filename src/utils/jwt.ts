import * as jwt from 'jsonwebtoken';
import { jwtConfig } from '../config';

/**
 *Generates and returns a JWT token
 * @param payload
 * @returns JWT token
 */
function generateAccessToken(payload: any) {
  return jwt.sign({ payload }, jwtConfig.JWT_SECRET as jwt.Secret, {
    expiresIn: jwtConfig.JWT_EXPIRY,
  });
}

/**
 * Generates and returns a refresh token
 * @param payload
 * @returns Refresh token
 */
function generateRefreshToken(payload: any) {
  return jwt.sign({ payload }, jwtConfig.REFRESH_TOKEN_SECRET as jwt.Secret, {
    expiresIn: jwtConfig.REFRESH_TOKEN_EXPIRY,
  });
}

function generateResetToken(payload: any, secret: string) {
  return jwt.sign({ payload }, secret, {
    expiresIn: jwtConfig.RESET_TOKEN_EXPIRY,
  });
}

export { generateAccessToken, generateRefreshToken, generateResetToken };
