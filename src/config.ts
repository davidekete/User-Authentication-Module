import dotenv from 'dotenv';
dotenv.config();

const serverConfig = {
  PORT: process.env.PORT || 3000,
  BASE_URL: process.env.BASE_URL,
  ENVIRONMENT: process.env.NODE_ENV || 'development',
};

const dbConfig = {
  DATABASE_URI: process.env.DATABASE_URI,
};

const jwtConfig = {
  JWT_SECRET: process.env.JWT_TOKEN_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY || '86400s',
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY || '604800s',
  RESET_TOKEN_BASE: process.env.RESET_TOKEN_BASE_SECRET,
  RESET_TOKEN_EXPIRY: process.env.RESET_TOKEN_EXPIRY,
};

const mailConfig = {
  HOST: process.env.MAIL_HOST,
  PORT: process.env.MAIL_PORT,
  USER: process.env.MAIL_USER,
  PASSWORD: process.env.MAIL_PASSWORD,
};

export { serverConfig, dbConfig, jwtConfig, mailConfig };
