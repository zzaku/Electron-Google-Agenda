import { DateEvent } from "../core/models/event.interfaces";

export { }
declare global {
    interface Window {
        "electron": {
            addEvent: (event: DateEvent) => Promise<boolean>;
            getAllEvents: () => Promise<DateEvent[] | null>;
            getEventById: (eventId: number) => Promise<DateEvent | null>;
            updateEvent: (updatedEvent: Partial<DateEvent>) => Promise<boolean>;
            deleteEvent: (eventId: number) => Promise<boolean>;
            contextMenu: () => void;
        }
    }
}