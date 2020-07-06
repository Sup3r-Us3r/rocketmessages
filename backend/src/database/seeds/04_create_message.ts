import Knex from 'knex';

const date = new Date();

export async function seed(knex: Knex) {
  return knex('tb_message').insert([
    {
      from: 1,
      to_user: 2,
      message: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque eaque quae laborum impedit, commodi corporis aliquam laboriosam ullam repellendus minima molestiae quisquam consequatur aperiam, pariatur quo. Perspiciatis incidunt impedit velit.',
      image: 'https://w.wallhaven.cc/full/ym/wallhaven-ym2r8d.jpg',
      created_at: date,
    },
    {
      from: 1,
      to_user: 2,
      message: 'Lorem ipsum dolor sit amet.',
      created_at: date,
    },
    {
      from: 2,
      to_user: 1,
      message: 'Facilis, deserunt voluptatibus tenetur voluptates ipsam molestiae praesentium modi ducimus expedita repellat soluta, ipsa maiores qui. Necessitatibus hic molestiae totam odit, reiciendis aspernatur et earum commodi nisi, facilis sint dignissimos velit adipisci dolore eum iste veritatis doloremque. Ipsum corporis culpa harum nulla amet nam ex, qui natus at debitis et ipsam magni quia itaque adipisci non accusamus quae recusandae, error a veritatis! Eum saepe cum hic, expedita dolorum, tempore, beatae placeat voluptatum nobis velit impedit recusandae ipsum ut unde corporis assumenda officia asperiores. Nihil, beatae? Impedit aperiam minus, molestiae enim quam expedita.',
      created_at: date,
    },
    {
      from: 2,
      to_user: 1,
      message: 'Facilis, deserunt voluptatibus tenetur voluptates ipsam molestiae praesentium modi ducimus expedita repellat soluta, ipsa maiores qui.',
      created_at: date,
    },
    {
      from: 2,
      to_user: 1,
      message: 'Necessitatibus hic molestiae totam odit, reiciendis aspernatur et earum commodi nisi, facilis sint dignissimos velit adipisci dolore eum iste veritatis doloremque. Ipsum corporis culpa harum nulla amet nam ex, qui natus at debitis et ipsam magni quia itaque adipisci non accusamus quae recusandae, error a veritatis! Eum saepe cum hic, expedita dolorum, tempore, beatae placeat voluptatum nobis velit impedit recusandae ipsum ut unde corporis assumenda officia asperiores. Nihil, beatae? Impedit aperiam minus, molestiae enim quam expedita.',
      created_at: date,
    },
    {
      from: 3,
      to_user: 1,
      message: 'Impedit aperiam minus, molestiae enim quam expedita.',
      image: 'https://w.wallhaven.cc/full/zx/wallhaven-zx8vmy.jpg',
      created_at: date,
    },
    {
      from: 3,
      to_room: 1,
      message: 'Molestiae enim quam expedita.',
      image: 'https://w.wallhaven.cc/full/ox/wallhaven-oxl199.jpg',
      created_at: date,
    },
    {
      from: 3,
      to_room: 1,
      message: 'Deserunt repellat esse cum, dolorem voluptatem aliquid.',
      image: 'https://w.wallhaven.cc/full/83/wallhaven-83mxx2.png',
      created_at: date,
    },
    {
      from: 1,
      to_room: 1,
      message: 'repellat nemo mollitia earum facilis',
      created_at: date,
    },
    {
      from: 1,
      to_room: 2,
      message: 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
      image: 'https://w.wallhaven.cc/full/4d/wallhaven-4d1233.jpg',
      created_at: date,
    },
    {
      from: 4,
      to_room: 2,
      message: 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
      created_at: date,
    },
    {
      from: 4,
      to_room: 2,
      message: 'Deserunt repellat esse cum, dolorem voluptatem aliquid.',
      image: 'https://w.wallhaven.cc/full/w8/wallhaven-w8q386.png',
      created_at: date,
    },
  ]);
}
