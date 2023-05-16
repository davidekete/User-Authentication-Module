import { Request, Response } from 'express';
import {
  createUser,
  login,
  changePassword,
  forgotPassword as forgotPasswordService,
  refreshToken,
  resetPassword,
} from '../services/user.service';

async function createNewUser(req: Request, res: Response) {
  const { userName, firstName, lastName, email, password } = req.body;
}

async function userLogin(req: Request, res: Response) {}

async function getRefreshToken(req: Request, res: Response) {}

async function changeUserPassword(req: Request, res: Response) {}

async function forgotPassword(req: Request, res: Response) {}

async function resetUserPassword(req: Request, res: Response) {}

async function logout(req: Request, res: Response) {}

export {
  createNewUser,
  userLogin,
  getRefreshToken,
  changeUserPassword,
  forgotPassword,
  resetUserPassword,
};
