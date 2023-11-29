import knex from 'knex'

export interface Database {
  knex: knex.Knex,
  functions: Record<string,  (...args: any[]) => any>;
}