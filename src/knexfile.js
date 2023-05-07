/* eslint-disable comma-dangle */
// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URI,
    migrations: {
      directory: './database/migrations',
    },
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URI,
    migrations: {
      directory: './database/migrations',
    },
  },
};
