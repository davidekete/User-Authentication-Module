import bcrypt from 'bcrypt';
import { User } from '../database/models/user.model';
import { Request, Response } from 'express';
import { passwordStrength } from 'check-password-strength';
import { isEmail } from '../utils/isEmail';
import {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
} from '../utils/jwt';
import { sendResetPasswordEmail, sendWelcomeEmail } from './mail.service';
import { getFromDB, addToDB } from '../repository/user.repository';
import { Token } from '../database/models/token.model';
import * as jwt from 'jsonwebtoken';
import { jwtConfig, serverConfig, passConfig } from '../config';

/**
 * creates a new user
 * @param req
 * @param res
 * @param next
 * @returns a user object
 */

//create user
async function createUser(req: Request, res: Response) {
  const { userName, firstName, lastName, email, password } = req.body;

  //check if username or email already exists
  try {
    const userNameExists = await getFromDB(userName, User);
    const emailExists = await getFromDB(email, User);

    if (userNameExists != null) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    if (emailExists != null) {
      return res.status(400).json({ message: 'Email already exists' });
    }
  } catch (error) {
    console.log(error);
  }

  //check password strength
  const passwordDifficulty = passwordStrength(password);

  if (
    passwordDifficulty.value !== 'Strong' &&
    passwordDifficulty.value !== 'Medium'
  ) {
    return res.status(400).json({ message: 'Password is not strong enough' });
  }

  //hash password
  bcrypt
    .hash(password, passConfig.SALT_ROUNDS)
    .then(async (hash) => {
      if (hash) {
        addToDB(User, {
          userName,
          firstName,
          lastName,
          email,
          password: hash,
        })
          .then((newUser) => {
            sendWelcomeEmail(newUser);
            res.status(201).json({ newUser });
          })
          .catch((error) => {
            return res.status(500).json({ error: error.message });
          });
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

/**
 * logs in a user
 * @param req
 * @param res
 * @param next
 * @returns void
 */

async function login(req: Request, res: Response) {
  const { emailOrUsername, password } = req.body;

  try {
    let user;
    let field;
    let query;

    if (isEmail(emailOrUsername)) {
      field = 'email';
      query = { email: emailOrUsername };
    } else {
      field = 'userName';
      query = { userName: emailOrUsername };
    }

    user = await getFromDB(query, User);

    if (!user) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }

    const token = generateAccessToken(user[field]);
    const refreshToken = generateRefreshToken(user[field]);

    return res.status(200).json({
      message: 'User Logged in Successfully',
      token,
      refreshToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

/**
 *
 * @param req
 * @param res
 * @returns void
 */
async function refreshToken(req: Request, res: Response) {
  const refreshToken = req.body.token;

  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token provided' });
  }

  const validRefreshToken = await getFromDB(refreshToken, Token);

  if (!validRefreshToken) {
    return res.status(403).json({ message: 'Refresh token is not valid' });
  }

  jwt.verify(
    refreshToken,
    jwtConfig.REFRESH_TOKEN_SECRET as jwt.Secret,
    (err: any, user: any) => {
      if (err) {
        return res.status(403).json({ message: 'Refresh token is not valid' });
      }

      const accessToken = generateAccessToken(user);

      return res.status(200).json({ accessToken });
    }
  );
}

async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;

    //validate if input is email

    const user = await getFromDB(email, User);

    if (!user) {
      return res.status(403).json({ message: 'Invalid user credentials' });
    }

    const jwtResetSecret = `${jwtConfig.RESET_TOKEN_BASE}${user.password}`;
    const resetToken = generateResetToken(email, jwtResetSecret);

    const link = `${serverConfig.BASE_URL}/${user.id}/${resetToken}`;
    await sendResetPasswordEmail(user, link);
    res.status(200).json({ message: 'Reset link sent to email' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function resetPassword(req: Request, res: Response) {
  try {
    const { id, token } = req.params;

    const user = await getFromDB(id, User);

    if (!user) {
      return res.status(403).json({ message: 'Invalid reset link' });
    }

    const jwtResetSecret = `${jwtConfig.RESET_TOKEN_BASE}${user.password}`;

    jwt.verify(token, jwtResetSecret, async (err: any, decoded: any) => {
      if (err) {
        return res
          .status(403)
          .json({ message: 'Invalid or expired reset link' });
      }

      /**
       * Show password reset screen
       */
      const newPassword = req.body.password;

      const hash = await bcrypt.hash(newPassword, passConfig.SALT_ROUNDS);

      user.password = hash;

      await user.save().then(() => {
        res.status(200).json({ message: 'Password reset successful' });
        //Send reset password email
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function changePassword(req: Request, res: Response) {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await getFromDB(req.user, User);

    if (!user) {
      return res.status(403).json({ message: 'Invalid user credentials' });
    }

    const passwordsMatch = await bcrypt.compare(oldPassword, newPassword);

    if (passwordsMatch) {
      return res
        .status(403)
        .json({ message: 'Old password and new password cannot be the same' });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }

    const passwordDifficulty = passwordStrength(newPassword);

    if (
      passwordDifficulty.value !== 'Strong' &&
      passwordDifficulty.value !== 'Medium'
    ) {
      return res.status(400).json({ message: 'Password is not strong enough' });
    }

    const hash = await bcrypt.hash(newPassword, passConfig.SALT_ROUNDS);

    user.password = hash;

    await user.save().then(() => {
      res.status(200).json({ message: 'Password changed successfully' });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function logout(req: Request, res: Response) {
  /**
   * Depending on your application's needs, you can choose to expire the access tokens quickly or store the access tokens in a database
   * and invalidate them when a user logs out.
   * Allowing the frontend to handle logout requests by deleting the access and refresh tokens from the browser's local storage is a viable option.
   * However, if your application requires a lot of security and you want to be able to invalidate tokens, you can store the tokens in a database.
   * Although, storing the jsonwebtoken in a database renders the stateless nature of the token useless.
   */
}

exports = {
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword,
}