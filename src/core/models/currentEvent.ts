import { DateEvent } from "./event.interfaces";

export interface ExtendedCurrentEvent extends DateEvent {
    action?: 'create' | 'edit';
  }