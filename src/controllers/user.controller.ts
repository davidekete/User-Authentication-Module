import { Request, Response } from 'express';
import {
  createUser,
  login,
  changePassword,
  forgotPassword as forgotPasswordService,
  refreshToken,
  resetPassword,
} from '../services/user.service';
import Joi from 'joi';

async function createNewUser(req: Request, res: Response) {
  const { userName, firstName, lastName, email, password } = req.body;

  const schema = Joi.object({
    userName: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate({
    userName,
    firstName,
    lastName,
    email,
    password,
  });

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const newUser = await createUser(
      userName,
      firstName,
      lastName,
      email,
      password
    );

    return res.status(201).json({ newUser });
  } catch (error: any) {
    return res.status(500).json({ error });
  }
}

async function userLogin(req: Request, res: Response) {
  const { emailOrUsername, password } = req.body;

  const schema = Joi.object({
    emailOrUsername: Joi.string().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate({
    emailOrUsername,
    password,
  });

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const { accessToken, refreshToken, message } = await login(
      emailOrUsername,
      password
    );

    return res.status(200).json({ accessToken, refreshToken, message });
  } catch (error: any) {
    return res.status(500).json({ error });
  }
}

async function getRefreshToken(req: Request, res: Response) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh Token is required' });
  }

  try {
    const { accessToken } = await refreshToken(refreshToken);

    return res.status(200).json({ accessToken });
  } catch (error: any) {
    return res.status(500).json({ error });
  }
}

async function forgotPassword(req: Request, res: Response) {
  const { email } = req.body;

  const schema = Joi.object({
    email: Joi.string().email().required(),
  });

  const { error } = schema.validate({
    email,
  });

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    await forgotPasswordService(email);
    return res.status(200).json({ message: 'Email sent' });
  } catch (error) {
    return res.status(500).json({ error });
  }
}

async function resetUserPassword(req: Request, res: Response) {
  const { id, token } = req.params;

  const schema = Joi.object({
    id: Joi.string().required(),
    token: Joi.string().required(),
  });

  const { error } = schema.validate({
    id,
    token,
  });

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const { newPassword } = req.body;

  try {
    await resetPassword(id, token, newPassword);
    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    return res.status(500).json({ error });
  }
}

async function changeUserPassword(req: Request, res: Response) {
  const { oldPassword, newPassword } = req.body;

  const schema = Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
  });

  const { error } = schema.validate({
    oldPassword,
    newPassword,
  });

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    await changePassword(oldPassword, newPassword, req.user);
    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error: any) {
    return res.status(500).json({ error });
  }
}

async function logout(req: Request, res: Response) {}

export {
  createNewUser,
  userLogin,
  getRefreshToken,
  changeUserPassword,
  forgotPassword,
  resetUserPassword,
};
