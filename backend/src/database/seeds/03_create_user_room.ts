import Knex from 'knex';

export async function seed(knex: Knex) {
  return knex('tb_user_room').insert([
    {
      user_id: 1,
      room_id: 1,
      user_admin: true,
    },
    {
      user_id: 2,
      room_id: 1,
      user_admin: false,
    },
    {
      user_id: 3,
      room_id: 1,
      user_admin: false,
    },
    {
      user_id: 2,
      room_id: 2,
      user_admin: false,
    },
    {
      user_id: 3,
      room_id: 2,
      user_admin: true,
    },
  ]);
}
