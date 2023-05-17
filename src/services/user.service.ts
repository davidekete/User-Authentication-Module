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
import {
  getFromDB,
  addToDB,
  acquireFromDB,
} from '../repository/user.repository';
import * as jwt from 'jsonwebtoken';
import { jwtConfig, serverConfig, passConfig } from '../config';
import { generateError } from '../utils/generateError';

//create user
async function createUser(
  username: string,
  firstname: string,
  lastname: string,
  email: string,
  password: string
) {
  //check if username or email already exists
  try {
    const userNameExists = await getFromDB(username, User);
    const emailExists = await getFromDB(email, User);

    if (userNameExists != null) {
      throw generateError(
        'Duplicate username entry',
        400,
        'Username already exists'
      );
    }

    if (emailExists != null) {
      throw generateError('Duplicate email entry', 400, 'Email already exists');
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
    throw generateError(
      'Password difficulty',
      400,
      'Password is not strong enough'
    );
  }

  //hash password

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    //create user
    const newUser = await addToDB(User, {
      username,
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    sendWelcomeEmail(newUser);

    return newUser;
  } catch (error: any) {
    console.log(error);
    throw generateError(error.message, 500, error.errors[0].message);
  }
}

async function login(emailOrUsername: string, password: string) {
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

    user = await acquireFromDB(User, query);

    if (!user) {
      throw generateError('Invalid Credentials', 401, 'Invalid Credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw generateError('Invalid Credentials', 401, 'Invalid Credentials');
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
    throw generateError('Internal Server Error', 500, error.message);
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
    throw generateError('Internal Server Error', 500, error.message);
  }
}

async function forgotPassword(email: string) {
  try {
    const user = await acquireFromDB(User, { email });

    if (!user) {
      throw generateError(
        'Invalid user credentials',
        403,
        'Invalid user credentials'
      );
    }

    const jwtResetSecret = `${jwtConfig.RESET_TOKEN_BASE}${user.password}`;
    const resetToken = generateResetToken(email, jwtResetSecret);

    const link = `/api/${serverConfig.BASE_URL}/${user.id}/${resetToken}`;
    await sendResetPasswordEmail(user, link);
  } catch (error: any) {
    console.log(error);
    throw generateError(error.message, 500, error);
  }
}

async function resetPassword(id: string, token: string, newPassword: string) {
  try {
    const user = await acquireFromDB(User, { id });

    if (!user) {
      throw generateError('Invalid reset link', 403, 'Invalid reset link');
    }

    const jwtResetSecret = `${jwtConfig.RESET_TOKEN_BASE}${user.password}`;

    jwt.verify(token, jwtResetSecret, async (err: any, decoded: any) => {
      if (err) {
        throw generateError('Invalid or expired reset link', 403, err);
      }

      /**
       * Show password reset screen
       */

      const hash = await bcrypt.hash(newPassword, 10);

      user.password = hash;

      return await user.save();
    });
  } catch (error: any) {
    console.log(error);
    throw generateError(error.message, 500, error);
  }
}


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
