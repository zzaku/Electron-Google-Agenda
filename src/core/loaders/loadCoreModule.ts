import myDb from "./loadDatabase";
import { Database } from "../models/db.interfaces";
import {addEvent, getAllEvents, getEventById, updateEvent, deleteEvent} from "../functions/eventFeatures"

export const db: Database = {knex: myDb, functions: {
    addEvent, 
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent
}};