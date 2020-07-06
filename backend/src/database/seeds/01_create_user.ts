import Knex from 'knex';

const date = new Date();

export async function seed(knex: Knex) {
  return knex('tb_user').insert([
    {
      username: 'Arch',
      login: 'arch',
      photo: 'https://avatars0.githubusercontent.com/u/22561893?s=460&u=fcc8d1cf270f6eb3c101fcd56021713a379c43a9&v=4',
      status: 'Arch Linux forever!',
      created_at: date,
    },
    {
      username: 'Sup3r Us3r',
      login: 'sup3r.us3r',
      photo: 'https://avatars0.githubusercontent.com/u/22561893?s=460&u=fcc8d1cf270f6eb3c101fcd56021713a379c43a9&v=4',
      status: 'Developing is love',
      created_at: date,
    },
    {
      username: 'Us3r Ro0t',
      login: 'us3r.ro0t',
      photo: 'https://avatars0.githubusercontent.com/u/22561893?s=460&u=fcc8d1cf270f6eb3c101fcd56021713a379c43a9&v=4',
      status: 'With big powers come big responsabilities',
      created_at: date,
    },
    {
      username: 'User1',
      login: 'user1',
      photo: 'https://avatars0.githubusercontent.com/u/22561893?s=460&u=fcc8d1cf270f6eb3c101fcd56021713a379c43a9&v=4',
      status: 'Test Status1',
      created_at: date,
    },
    {
      username: 'User2',
      login: 'user2',
      photo: 'https://avatars0.githubusercontent.com/u/22561893?s=460&u=fcc8d1cf270f6eb3c101fcd56021713a379c43a9&v=4',
      status: 'Test Status2',
      created_at: date,
    },
  ]);
}
