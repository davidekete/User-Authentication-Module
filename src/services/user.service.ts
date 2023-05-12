import bcrypt from 'bcrypt';
import db from '../database/db';
import { Request, Response } from 'express';
import { passwordStrength } from 'check-password-strength';
import { error } from 'console';

async function createUser(req: Request, res: Response, next: any) {
  const { username, firstname, lastname, email, password } = req.body;

  const userNameExists = await db('usr_info').where({ username });
  const emailExists = await db('usr_info').where({ email });

  if (userNameExists.length !== 0) {
    res.status(400).json({ message: 'Username already exists' });
  }

  if (emailExists.length !== 0) {
    res.status(400).json({ message: 'Email already exists' });
  }

  const passwordDifficulty = passwordStrength(password);

  if (
    passwordDifficulty.value !== 'Strong' &&
    passwordDifficulty.value !== 'Medium'
  ) {
    res.status(400).json({ message: 'Password is not strong enough' });
  }

  const SALT_ROUNDS = 10;

  bcrypt
    .hash(password, SALT_ROUNDS)
    .then(async (hash) => {
      if (hash) {
        try {
          const newUser = await db('usr_info').insert({
            username,
            firstname,
            lastname,
            email,
            password: hash,
          });
          res.status(201).json({ newUser });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
