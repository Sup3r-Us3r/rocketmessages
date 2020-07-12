import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('tb_user', table => {
    table.increments('id').primary();
    table.string('username').notNullable();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.string('photo');
    table.string('status');
    table.date('created_at').notNullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('tb_user');
}
