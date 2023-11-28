import myDb from "./loaders/loadDatabase";
import { Database } from "./models/db.interfaces";
import * as agendaFeatures from "./features/agendaFeatures"

export const db: Database = {knex: myDb, functions: agendaFeatures};