import { Request, Response } from 'express';
import {
  createUser,
  login,
  changePassword,
  forgotPassword as forgotPasswordService,
  refreshToken as refreshTokenService,
  resetPassword,
} from '../services/user.service';
import { CustomError } from '../utils/generateError';

async function createNewUser(req: Request, res: Response) {
  try {
    const newUser = await createUser(req.body);

    return res.status(201).json({ newUser });
  } catch (error: any) {
    throw new CustomError(error);
  }
}

async function userLogin(req: Request, res: Response) {
  try {
    const { accessToken, refreshToken, message } = await login(req.body);

    return res.status(200).json({ accessToken, refreshToken, message });
  } catch (error: any) {
    throw new CustomError(error);
  }
}

async function getRefreshToken(req: Request, res: Response) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new CustomError('INVALID_TOKEN', 400, 'Refresh Token is required');
  }

  try {
    const accessToken = await refreshTokenService(refreshToken);

    return res.status(200).json({ accessToken });
  } catch (error: any) {
    throw new CustomError(error);
  }
}

async function forgotPassword(req: Request, res: Response) {
  try {
    await forgotPasswordService(req.body.email);
    return res
      .status(200)
      .json({ message: `We've sent a password reset link to your email` });
  } catch (error: any) {
    throw new CustomError(error);
  }
}

async function resetUserPassword(req: Request, res: Response) {
  try {
    await resetPassword(req.params.id, req.params.token, req.body.newPassword);
    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (error: any) {
    throw new CustomError(error);
  }
}

async function changeUserPassword(req: Request, res: Response) {
  try {
    //@ts-expect-error
    await changePassword(req.body.oldPassword, req.body.newPassword, req.user);
    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error: any) {
    throw new CustomError(error);
  }
}

export {
  createNewUser,
  userLogin,
  getRefreshToken,
  changeUserPassword,
  forgotPassword,
  resetUserPassword,
};
