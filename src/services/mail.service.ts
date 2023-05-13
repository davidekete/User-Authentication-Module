import nodemailer from 'nodemailer';
import { mailConfig } from '../config';

export const transporter = nodemailer.createTransport({
  //@ts-expect-error
  host: mailConfig.HOST,
  port: mailConfig.PORT,
  auth: {
    user: mailConfig.USER,
    pass: mailConfig.PASSWORD,
  },
});
