import { dbConfig } from '../config';

import { Sequelize } from 'sequelize';
const sq = new Sequelize(dbConfig.DATABASE_URI);

const testDbConnection = async () => {
  try {
    await sq.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export { sq, testDbConnection };