import Knex from 'knex';

const date = new Date();

export async function seed(knex: Knex) {
  return knex('tb_room').insert([
    {
      name: 'Group 1',
      nickname: 'group1',
      avatar: 'https://img.quizur.com/f/img5dc96ec0dd5ec8.79564947.jpg?lastEdited=1573482183',
      created_at: date,
    },
    {
      name: 'Group 2',
      nickname: 'group2',
      avatar: 'https://criticalhits.com.br/wp-content/uploads/2019/12/20190920-cropped-20190920-sasuke_t2gh-1200x675-910x512.jpg',
      created_at: date,
    },
  ]);
}
