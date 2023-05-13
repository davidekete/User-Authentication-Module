import dotenv from 'dotenv';
dotenv.config();

export const serverConfig = {
  PORT: process.env.PORT || 3000,
};

export const dbConfig = {
  DATABASE_URI: process.env.DATABASE_URI,
};

export const tokenData = {
  JWT_SECRET: process.env.JWT_TOKEN_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY || '86400s',
};

export const mailConfig = {
  HOST: process.env.MAIL_HOST,
  PORT: process.env.MAIL_PORT,
  USER: process.env.MAIL_USER,
  PASSWORD: process.env.MAIL_PASSWORD,
};
