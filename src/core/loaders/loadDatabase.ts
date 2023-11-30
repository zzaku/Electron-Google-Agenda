import knex from 'knex';
import * as dotenv from 'dotenv';
dotenv.config();

console.log(process.env.BDD, process.env.USER_DB,process.env.HOST_DB,process.env.PASSWORD_DB);

const myDb: knex.Knex = knex({
    client: 'mysql',
    connection: {
      host: process.env.HOST_DB,
      port : 3306,
      user: process.env.USER_DB,
      password: process.env.PASSWORD_DB,
      database: process.env.BDD
    }
  });


  export default myDb;
