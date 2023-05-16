import bcrypt from 'bcrypt';
import { User } from '../database/models/user.model';
import { passwordStrength } from 'check-password-strength';
import { isEmail } from '../utils/isEmail';
import {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
} from '../utils/jwt';
import { sendResetPasswordEmail, sendWelcomeEmail } from './mail.service';
import { getFromDB, addToDB } from '../repository/user.repository';
import * as jwt from 'jsonwebtoken';
import { jwtConfig, serverConfig, passConfig } from '../config';
import { generateError } from '../utils/generateError';

/**
 * @description Creates a new user
 * @param userName
 * @param firstName
 * @param lastName
 * @param email
 * @param password
 */

//create user
async function createUser(
  userName: string,
  firstName: string,
  lastName: string,
  email: string,
  password: string
) {
  //check if username or email already exists
  try {
    const userNameExists = await getFromDB(userName, User);
    const emailExists = await getFromDB(email, User);

    if (userNameExists != null) {
      throw generateError('Username already exists', 400);
    }

    if (emailExists != null) {
      throw generateError('Email already exists', 400);
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
    throw generateError('Password is not strong enough', 400);
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
            // res.status(201).json({ newUser });
          })
          .catch((error) => {
            throw generateError(error.message, 500);
          });
      }
    })
    .catch((error) => {
      console.log(error);
      throw generateError(error.message, 500);
    });
}

/**
 * @description Logs in a user
 * @param emailOrUsername
 * @param password
 * @returns Access token, refresh token and message
 */

async function login(emailOrUsername: string, password: string) {
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
      throw generateError('Invalid Credentials', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw generateError('Invalid Credentials', 401);
    }

    const token = generateAccessToken(user[field]);
    const refreshToken = generateRefreshToken(user[field]);

    return {
      message: 'User Logged in Successfully',
      token,
      refreshToken,
    };
  } catch (error) {
    console.log(error);
    throw generateError('Internal Server Error', 500);
  }
}

/**
 * @description grants a new access token based on a valid refresh token
 * @param refreshToken
 * @returns access token
 */
async function refreshToken(refreshToken: string) {
  if (!refreshToken) {
    throw generateError('No refresh token provided', 401);
  }

  jwt.verify(
    refreshToken,
    jwtConfig.REFRESH_TOKEN_SECRET as jwt.Secret,
    (err: any, user: any) => {
      if (err) {
        throw generateError('Refresh token is not valid', 403);
      }

      const accessToken = generateAccessToken(user);

      return accessToken;
    }
  );
}

/**
 * @description
 * @param email
 * @returns
 */
async function forgotPassword(email: string) {
  try {
    const user = await getFromDB(email, User);

    if (!user) {
      throw generateError('Invalid user credentials', 403);
    }

    const jwtResetSecret = `${jwtConfig.RESET_TOKEN_BASE}${user.password}`;
    const resetToken = generateResetToken(email, jwtResetSecret);

    const link = `${serverConfig.BASE_URL}/${user.id}/${resetToken}`;
    return await sendResetPasswordEmail(user, link);
  } catch (error: any) {
    console.log(error);
    throw generateError(error.message, 500);
  }
}

/**
 * @description Resets a user's password
 * @param id
 * @param token
 * @param newPassword
 */
async function resetPassword(id: string, token: string, newPassword: string) {
  try {
    const user = await getFromDB(id, User);

    if (!user) {
      throw generateError('Invalid reset link', 403);
    }

    const jwtResetSecret = `${jwtConfig.RESET_TOKEN_BASE}${user.password}`;

    jwt.verify(token, jwtResetSecret, async (err: any, decoded: any) => {
      if (err) {
        throw generateError('Invalid or expired reset link', 403);
      }

      /**
       * Show password reset screen
       */

      const hash = await bcrypt.hash(newPassword, passConfig.SALT_ROUNDS);

      user.password = hash;

      return await user.save();
    });
  } catch (error: any) {
    console.log(error);
    throw generateError(error.message, 500);
  }
}

/**
 * @description Changes a user's password
 * @param oldPassword
 * @param newPassword
 * @param userObj
 * @returns
 */
async function changePassword(
  oldPassword: string,
  newPassword: string,
  userObj: any
) {
  try {
    const user = await getFromDB(userObj, User);

    if (!user) {
      throw generateError('Invalid user credentials', 403);
    }

    const passwordsMatch = await bcrypt.compare(oldPassword, newPassword);

    if (passwordsMatch) {
      throw generateError(
        'Old password and new password cannot be the same',
        403
      );
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      throw generateError('Invalid Credentials', 401);
    }

    const passwordDifficulty = passwordStrength(newPassword);

    if (
      passwordDifficulty.value !== 'Strong' &&
      passwordDifficulty.value !== 'Medium'
    ) {
      throw generateError('Password is not strong enough', 400);
    }

    const hash = await bcrypt.hash(newPassword, passConfig.SALT_ROUNDS);

    user.password = hash;

    return await user.save();
  } catch (error: any) {
    console.log(error);
    throw generateError(error.message, 500);
  }
}

async function logout() {
  /**
   * Depending on your application's needs, you can choose to expire the access tokens quickly or store the access tokens in a database
   * and invalidate them when a user logs out.
   * Allowing the frontend to handle logout requests by deleting the access and refresh tokens from the browser's local storage is a viable option.
   * However, if your application requires a lot of security and you want to be able to invalidate tokens, you can store the tokens in a database.
   * Although, storing the jsonwebtoken in a database renders the stateless nature of the token useless.
   */
}

export {
  createUser,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword,
};
