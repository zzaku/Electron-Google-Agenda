import { CurrentDateCalendar } from "../core/models/currentDateCalendar.interface"
import { DateEvent } from "../core/models/event.interfaces";


export { }
declare global {
    interface Window {
        "electron": {
            loadCalendar: (event: {year?: number, month?: number, type: {module: 'year' | 'month', action?: 'previous' | 'next'}}) => Promise<CurrentDateCalendar>;
            addEvent: (event: DateEvent) => Promise<boolean>;
            getAllEvents: () => Promise<DateEvent[] | null>;
            getEventById: (eventId: number) => Promise<DateEvent | null>;
            updateEvent: (updatedEvent: Partial<DateEvent>) => Promise<boolean>;
            deleteEvent: (eventId: number) => Promise<boolean>;
            contextMenu: () => void;
            showEvent: (eventId: number) => void;
            eventDetail:  () => void;
            }

    }

}
