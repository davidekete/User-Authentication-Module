import dotenv from 'dotenv';
dotenv.config();

export const dbConfig = {
  DATABASE_URI: process.env.DATABASE_URI,
};

export const tokenData = {
  JWT_SECRET: process.env.JWT_TOKEN_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY || '86400s'
};
