/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('usr_info', (table) => {
    table.increments('id').primary();
    table.string('username').notNullable().unique();
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('usr_info');
}
