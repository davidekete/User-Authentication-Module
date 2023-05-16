import express from 'express';
import { verifyToken } from '../middleware/verifyJwt';
import {
  createUser,
  login,
  changePassword,
  forgotPassword,
  refreshToken,
  resetPassword,
} from '../services/user.service';

const router = express.Router();

router.post('api/auth/login', login);

router.post('api/auth/logout', verifyToken);

router.post('api/auth/refresh-token', refreshToken);

router.post('api/signup', createUser);

router.post('api/forgot-password', forgotPassword);

router.post('api/change-password', verifyToken, changePassword);

router.post('api/reset-password', resetPassword);
