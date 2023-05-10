/* eslint-disable comma-dangle */
// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export const development = {
  client: 'pg',
  connection: process.env.DATABASE_URI,
  migrations: {
    directory: './src/database/migrations',
  },
};
export const production = {
  client: 'pg',
  connection: process.env.DATABASE_URI,
  migrations: {
    directory: './src/database/migrations',
  },
};
