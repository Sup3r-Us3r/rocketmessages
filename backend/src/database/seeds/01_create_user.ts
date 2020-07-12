import Knex from 'knex';
import bcrypt from 'bcryptjs';

const date = new Date();
const hash = bcrypt.hashSync('123456789', 8);

export async function seed(knex: Knex) {
  return knex('tb_user').insert([
    {
      username: 'Arch',
      email: 'arch@mail.com',
      password: hash,
      photo: 'https://avatars0.githubusercontent.com/u/22561893?s=460&u=fcc8d1cf270f6eb3c101fcd56021713a379c43a9&v=4',
      status: 'Arch Linux forever!',
      created_at: date,
    },
    {
      username: 'Sup3r Us3r',
      email: 'sup3r.us3r@mail.com',
      password: hash,
      photo: 'https://avatars0.githubusercontent.com/u/22561893?s=460&u=fcc8d1cf270f6eb3c101fcd56021713a379c43a9&v=4',
      status: 'Developing is love',
      created_at: date,
    },
    {
      username: 'Us3r Ro0t',
      email: 'us3r.ro0t@mail.com',
      password: hash,
      photo: 'https://avatars0.githubusercontent.com/u/22561893?s=460&u=fcc8d1cf270f6eb3c101fcd56021713a379c43a9&v=4',
      status: 'With big powers come big responsabilities',
      created_at: date,
    },
    {
      username: 'User1',
      email: 'user1@mail.com',
      password: hash,
      photo: 'https://avatars0.githubusercontent.com/u/22561893?s=460&u=fcc8d1cf270f6eb3c101fcd56021713a379c43a9&v=4',
      status: 'Test Status1',
      created_at: date,
    },
    {
      username: 'User2',
      email: 'user2@mail.com',
      password: hash,
      photo: 'https://avatars0.githubusercontent.com/u/22561893?s=460&u=fcc8d1cf270f6eb3c101fcd56021713a379c43a9&v=4',
      status: 'Test Status2',
      created_at: date,
    },
  ]);
}
