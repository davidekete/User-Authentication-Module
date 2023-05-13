import { sq } from '../db';
import { DataTypes } from 'sequelize';

export const Token = sq.define('token', {
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isRevoked: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.STRING, //
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
  },
  updated_at: {
    type: DataTypes.DATE,
  },
});
