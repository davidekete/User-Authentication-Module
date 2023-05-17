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

const router = express.Router();
router.post('/api/signup', createNewUser);

router.post('api/auth/login', userLogin);

router.post('api/auth/refresh-token', getRefreshToken);

router.post('api/change-password', verifyToken, changeUserPassword);

router.post('api/forgot-password', forgotPassword);

router.post('api/reset-password', resetUserPassword);

router.post('api/auth/logout', verifyToken);

export default router;
