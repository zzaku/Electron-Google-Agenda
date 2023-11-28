import * as Knex from 'knex';

const myDb: Knex.Knex = require('knex')({
    client: 'mysql',
    connection: {
      host: process.env.HOST_DB,
      port : process.env.PORT_DB,
      user: process.env.USER_DB,
      password: process.env.PASSWORD_DB,
      database: process.env.BDD
    }
  });

export default myDb;