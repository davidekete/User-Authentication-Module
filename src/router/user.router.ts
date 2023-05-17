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
import { acquireFromDB } from '../repository/user.repository';
import { User } from '../database/models/user.model';

const router = express.Router();
router.post('/api/signup', createNewUser);

router.post('/api/auth/login', userLogin);

router.post('/api/auth/refresh-token', getRefreshToken);

router.post('/api/change-password', verifyToken, changeUserPassword);

router.post('/api/forgot-password', forgotPassword);

router.post('/api/:id/:token', resetUserPassword);

router.post('/api/auth/logout', verifyToken);

router.get('/api/user', verifyToken, async (req, res) => {
  const { email } = req.body;

  const user = await acquireFromDB(User, { email });

  return res.status(200).json({ message: 'User found', user });
});

export default router;
