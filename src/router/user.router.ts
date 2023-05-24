import express from 'express';
import { verifyToken } from '../middleware/verifyJwt';
import {
  createNewUser,
  userLogin,
  getRefreshToken,
  changeUserPassword,
  forgotPassword,
  resetUserPassword,
} from '../controllers/user.controller';
import {
  createAccountLimiter,
  resetPasswordLimiter,
  forgotPasswordLimiter,
  loginAttemptLimiter,
  refreshTokenLimiter,
} from '../utils/rateLimit';
import createUserValidator from '../middleware/createUserValidator';

const router = express.Router();
router.post(
  '/api/signup',
  createUserValidator,
  createAccountLimiter,
  createNewUser
);

router.post('/api/auth/login', loginAttemptLimiter, userLogin);

router.post('/api/auth/refresh-token', refreshTokenLimiter, getRefreshToken);

router.post(
  '/api/change-password',
  resetPasswordLimiter,
  verifyToken,
  changeUserPassword
);

router.put('/activate');

router.post('/api/forgot-password', forgotPasswordLimiter, forgotPassword);

router.post('/reset/:id/:token', resetPasswordLimiter, resetUserPassword);

router.post('/api/auth/logout', verifyToken);

export default router;
