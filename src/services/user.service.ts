import bcrypt from 'bcrypt';
import { User } from '../database/models/user.model';
import { Request, Response } from 'express';
import { passwordStrength } from 'check-password-strength';
import { isEmail } from '../utils/isEmail';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { sendWelcomeEmail } from '../utils/sendEmail';
import { transporter } from './mail.service';
import { getFromDB, addToDB } from '../repository/user.repository';
import { Token } from '../database/models/token.model';
import * as jwt from 'jsonwebtoken';
import { jwtConfig } from '../config';

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns
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

  const SALT_ROUNDS = 10;

  //hash password
  bcrypt
    .hash(password, SALT_ROUNDS)
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
            sendWelcomeEmail(transporter, newUser);
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
 *
 * @param req
 * @param res
 * @param next
 * @returns
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



}

async function resetPassword(req: Request, res: Response) {


}
