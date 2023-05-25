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
import { addToDB, getFromDB } from '../repository/user.repository';
import * as jwt from 'jsonwebtoken';
import { jwtConfig, serverConfig } from '../config';
import { CustomError } from '../utils/generateError';
import { UserData } from '../types/userdata';
import { loginData } from '../types/loginData';

const SALT_ROUNDS = 10;

async function createUser(requestBody: UserData) {
  const { username, firstname, lastname, email, password } = requestBody;

  //check if username or email already exists
  const userNameExists = await getFromDB(User, { username });
  const emailExists = await getFromDB(User, { email });

  if (userNameExists != null || emailExists != null) {
    throw new CustomError('DUPLICATE_IDENTIFIER');
  }

  //check password strength
  const passwordDifficulty = passwordStrength(password);

  if (
    passwordDifficulty.value !== 'Strong' &&
    passwordDifficulty.value !== 'Medium'
  ) {
    throw new CustomError('WEAK_PASSWORD');
  }

  //hash password

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    //create user
    const newUser = await addToDB(User, {
      username,
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    if (process.env.NODE_ENV === 'development') sendWelcomeEmail(newUser);

    return newUser;
  } catch (error: any) {
    console.log(error);
    throw new CustomError(error);
  }
}

async function login(requestBody: loginData) {
  const { emailOrUsername, password } = requestBody;

  try {
    let user;
    let field;
    let query;

    if (isEmail(emailOrUsername)) {
      field = 'email';
      query = { email: emailOrUsername };
    } else {
      field = 'username';
      query = { username: emailOrUsername };
    }

    user = await getFromDB(User, query);

    if (!user) {
      throw new CustomError('USER_NOT_FOUND');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new CustomError('INVALID_EMAIL_OR_PASSWORD');
    }

    const token = generateAccessToken(user[field]);
    const refreshToken = generateRefreshToken(user[field]);

    return {
      message: 'User Logged in Successfully',
      accessToken: token,
      refreshToken,
    };
  } catch (error: any) {
    console.log(error);
    throw new CustomError(error);
  }
}

async function refreshToken(refreshToken: string) {
  try {
    let userPayload = jwt.verify(
      refreshToken,
      jwtConfig.REFRESH_TOKEN_SECRET as jwt.Secret
    );

    const accessToken = generateAccessToken(userPayload);
    return accessToken;
  } catch (error: any) {
    console.log(error);
    throw new CustomError(error);
  }
}

async function forgotPassword(email: string) {
  try {
    const user = await getFromDB(User, { email });

    if (!user) {
      throw new CustomError('USER_NOT_FOUND');
    }

    const jwtResetSecret = `${jwtConfig.RESET_TOKEN_BASE}${user.password}`;
    const resetToken = generateResetToken(email, jwtResetSecret);

    const link = `/reset/${serverConfig.BASE_URL}/${user.id}/${resetToken}`;
    await sendResetPasswordEmail(user, link);
  } catch (error: any) {
    console.log(error);
    throw new CustomError(error);
  }
}

async function resetPassword(id: string, token: string, newPassword: string) {
  try {
    const user = await getFromDB(User, { id });

    if (!user) {
      // throw generateError('Invalid reset link', 403, 'Invalid reset link');
      throw new CustomError('INVALID_PASSWORD_RESET_LINK');
    }

    const jwtResetSecret = `${jwtConfig.RESET_TOKEN_BASE}${user.password}`;

    const decoded = jwt.verify(token, jwtResetSecret);
    if (decoded) {
      const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);

      user.password = hash;

      return await user.save();
    }
  } catch (error: any) {
    throw new CustomError(error);
  }
}

async function changePassword(
  oldPassword: string,
  newPassword: string,
  userObj: any
) {
  try {
    const emailOrUsername = userObj.payload;

    let user;
    let query;

    if (isEmail(emailOrUsername)) {
      query = { email: emailOrUsername };
    } else {
      query = { username: emailOrUsername };
    }

    user = await getFromDB(User, query);

    if (!user) {
      // throw generateError('Invalid user credentials', 403);
      throw new CustomError('USER_NOT_FOUND', 403);
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      // throw generateError(
      //   'Invalid Credentials',
      //   401,
      //   'Invalid Credentials: Passwords do not match'
      // );

      throw new CustomError('INVALID_EMAIL_OR_PASSWORD', 401);
    }

    const passwordsMatch = await bcrypt.compare(oldPassword, newPassword);

    if (passwordsMatch) {
      // throw generateError(
      //   'Same password',
      //   403,
      //   'Old password and new password cannot be the same'
      // );
      throw new CustomError(
        'INVALID_PASSWORD',
        undefined,
        'Old password and new password cannot be the same'
      );
    }

    const passwordDifficulty = passwordStrength(newPassword);

    if (
      passwordDifficulty.value !== 'Strong' &&
      passwordDifficulty.value !== 'Medium'
    ) {
      // throw generateError(
      //   'Password difficulty',
      //   400,
      //   'Password is not strong enough'
      // );
      throw new CustomError('WEAK_PASSWORD');
    }

    const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    user.password = hash;

    return await user.save();
  } catch (error: any) {
    console.log(error);
    throw new CustomError(error);
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
