import Knex from 'knex';
import { DateEvent } from '../models/event.interfaces';

const addEvent = async (knex: Knex.Knex, table: string, body: DateEvent): Promise<boolean> => {
  try {
    await knex(table).insert(body);
    return true;
  } catch (error) {
    console.error(`Error inserting event into database: ${error.message}`);
    return false;
  }
};

module.exports = {
    addEvent,
}