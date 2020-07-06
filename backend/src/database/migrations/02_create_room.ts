import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('tb_room', table => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('nickname').notNullable().unique();
    table.string('avatar');
    table.date('created_at').notNullable();
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTable('tb_room');
}
