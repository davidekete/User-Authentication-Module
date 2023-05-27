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
import loginDataValidator from '../middleware/loginDataValidator';
import {
  forgotPasswordValidator,
  resetPasswordValidator,
  changeUserPasswordValidator,
} from '../middleware/resetPassword';

const router = express.Router();
router.post(
  '/api/signup',
  createAccountLimiter,
  createUserValidator,
  createNewUser
);

router.post(
  '/api/auth/login',
  loginAttemptLimiter,
  loginDataValidator,
  userLogin
);

router.post('/api/auth/refresh-token', refreshTokenLimiter, getRefreshToken);

router.post(
  '/api/change-password',
  resetPasswordLimiter,
  changeUserPasswordValidator,
  verifyToken,
  changeUserPassword
);

router.post(
  '/api/forgot-password',
  forgotPasswordLimiter,
  forgotPasswordValidator,
  forgotPassword
);

router.post(
  '/reset/:id/:token',
  resetPasswordLimiter,
  resetPasswordValidator,
  resetUserPassword
);

router.post('/api/auth/logout', verifyToken);

export default router;
