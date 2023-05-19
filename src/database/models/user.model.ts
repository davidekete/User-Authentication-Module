import { sq } from '../db';
import { DataTypes } from 'sequelize';

export const User = sq.define('user', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  firstname: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  lastname: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

(async () => {
  await User.sync({force: true});
  console.log('User Model synced');
})();
