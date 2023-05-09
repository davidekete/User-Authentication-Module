/* eslint-disable comma-dangle */
// Update with your config settings.
import 'ts-node/register';

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export const development = {
  client: 'pg',
  connection: process.env.DATABASE_URI,
  migrations: {
    directory: './database/migrations',
  },
};
export const production = {
  client: 'pg',
  connection: process.env.DATABASE_URI,
  migrations: {
    directory: './database/migrations',
  },
};
