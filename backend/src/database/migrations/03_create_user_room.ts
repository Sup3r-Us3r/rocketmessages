import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('tb_user_room', table => {
    table.increments('id').primary();
    table.integer('user_id')
      .notNullable()
      .references('id')
      .inTable('tb_user');
    table.integer('room_id')
      .notNullable()
      .references('id')
      .inTable('tb_room');
    table.boolean('user_admin').notNullable();
  })
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('tb_user_room');
}