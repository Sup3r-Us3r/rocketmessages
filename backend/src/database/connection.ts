import knex from 'knex';
import { resolve } from 'path';
import {attachPaginate} from 'knex-paginate';

attachPaginate();

const connection = knex({
  client: 'sqlite3',
  connection: {
    filename: resolve(__dirname, 'database.sqlite'),
  },
  useNullAsDefault: true,
});

export default connection;
