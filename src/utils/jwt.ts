import * as jwt from 'jsonwebtoken'; 
import { tokenData } from '../config';

/**
 *
 * @param username
 * @returns JWT token
 */
export function generateAccessToken(username: string) {
  return jwt.sign(username, tokenData.JWT_SECRET as jwt.Secret, {
    expiresIn: tokenData.JWT_EXPIRY,
  });
}


