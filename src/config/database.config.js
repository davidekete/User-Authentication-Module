import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
  DATABASE_URI: process.env.DATABASE_URI,
};

export default dbConfig;