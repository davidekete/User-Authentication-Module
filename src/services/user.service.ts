import bcrypt from 'bcrypt';
import db from '../database/db';
import { Request, Response, NextFunction } from 'express';
import { passwordStrength } from 'check-password-strength';
import { isEmail } from '../utils/isEmail';
import { LoginData } from '../interfaces/loginData';
import { generateAccessToken } from '../utils/jwt';
import { sendWelcomeEmail } from '../utils/sendWelcomeEmail';
import { transporter } from './mail.service';


/**
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */

//create user
async function createUser(req: Request, res: Response, next: NextFunction) {
  const { username, firstname, lastname, email, password } = req.body;

  //check if username or email already exists
  try {
    const userNameExists = await db('usr_info').where({ username });
    const emailExists = await db('usr_info').where({ email });

    if (userNameExists.length !== 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    if (emailExists.length !== 0) {
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
        db('usr_info')
          .insert({
            username,
            firstname,
            lastname,
            email,
            password: hash,
          })
          .then((newUser) => {
            sendWelcomeEmail(transporter, newUser[0])
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

//login user
async function login(req: Request, res: Response, next: NextFunction) {
  const { emailOrUsername, password } = req.body;

  //check if user exists
  const userData: LoginData = { email: '', password, username: '' };
  let user;

  const isInputEmail = isEmail(emailOrUsername);

  if (isInputEmail) {
    userData.email = emailOrUsername;
    user = await db('usr_info').where({ email: emailOrUsername });

    if (user.length === 0) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }
  } else {
    userData.username = emailOrUsername;
    user = await db('usr_info').where({ username: emailOrUsername });

    if (user.length === 0) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }
  }

  //compare password
  bcrypt
    .compare(password, user[0].password)
    .then((result) => {
      console.log(result);
      const token = generateAccessToken(
        userData.email ? userData.email : userData.username
      );
      return res.status(200).json({ message: 'User Logged in Successfully' });
    })
    .catch((error) => {
      console.log(error);
      return res.status(401).json({ message: 'Invalid Credentials' });
    });
}
