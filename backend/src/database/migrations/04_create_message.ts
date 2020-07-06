import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('tb_message', table => {
    table.increments('id').primary();
    table.integer('from').notNullable();
    table.integer('to_user')
      .references('id')
      .inTable('tb_user');
    table.integer('to_room')
      .references('id')
      .inTable('tb_room');
    table.text('message').notNullable();
    table.string('image');
    table.date('created_at').notNullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('tb_message');
}
