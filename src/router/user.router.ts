import express from 'express';
import { verifyToken } from '../middleware/verifyJwt';

const router = express.Router();

router.post('api/auth/login');
router.post('api/auth/logout', verifyToken);

router.post('api/signup');

router.post('api/forgot-password');

router.post('api/change-password', verifyToken);

router.post('api/reset-password');
