import Knex from 'knex';
import { DateEvent } from '../models/event.interfaces';

export const addEvent = (knex: Knex.Knex, table: string, body: DateEvent): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    knex(table)
      .insert(body)
      .then(() => {
        resolve(true);
      })
      .catch((error: Error) => {
        console.error(`Error inserting event into database: ${error.message}`);
        reject(false);
      });
  });
};

export const getAllEvents = (knex: Knex.Knex, table: string): Promise<DateEvent[] | null> => {
  return new Promise((resolve, reject) => {
    knex(table)
      .select('*')
      .then((events: DateEvent[]) => {
        resolve(events);
      })
      .catch((error: Error) => {
        console.error(`Error retrieving all events from database: ${error.message}`);
        reject(null);
      });
  });
};

export const getEventById = (knex: Knex.Knex, table: string, eventId: number): Promise<DateEvent | null> => {
  return new Promise((resolve, reject) => {
    knex(table)
      .where('id', eventId)
      .first()
      .then((event: DateEvent | undefined) => {
        event ? resolve(event) : resolve(null);
      })
      .catch((error: Error) => {
        console.error(`Error retrieving event from database: ${error.message}`);
        reject(null);
      });
  });
};

export const getEventByDate = (knex: Knex.Knex, table: string, date: Date): Promise<DateEvent[] | null> => {
  return new Promise((resolve, reject) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    knex(table)
      .where('date_deb', '>=', startOfDay.toISOString())
      .andWhere('date_deb', '<=', endOfDay.toISOString())
      .orderBy('date_deb', 'asc')
      .then((events: DateEvent[]) => {
        resolve(events);
      })
      .catch((error: Error) => {
        console.error(`Error retrieving events by date from database: ${error.message}`);
        reject(null);
      });
  });
};


export const updateEvent = (knex: Knex.Knex, table: string, updatedEvent: Partial<DateEvent>): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    knex(table)
      .where('id', updatedEvent.id)
      .update(updatedEvent)
      .then(() => {
        resolve(true);
      })
      .catch((error: Error) => {
        console.error(`Error updating event in database: ${error.message}`);
        reject(false);
      });
  });
};

export const deleteEvent = (knex: Knex.Knex, table: string, eventId: number): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    knex(table)
      .where('id', eventId)
      .del()
      .then(() => {
        resolve(true);
      })
      .catch((error: Error) => {
        console.error(`Error deleting event from database: ${error.message}`);
        reject(false);
      });
  });
};
