import express from 'express';

const router = express.Router();

router.post('api/auth/login')
router.post('api/auth/logout')


router.post('api/signup')

router.post('api/user/forgot-password')

router.post('api/user/reset-password')
