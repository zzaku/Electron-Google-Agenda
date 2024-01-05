import { ExtendedCurrentEvent } from "../core/models/currentEvent";
import { CurrentDateCalendar } from "../core/models/currentDateCalendar.interface"
import { DateEvent } from "../core/models/event.interfaces";


export { }
declare global {
    interface Window {
        "electron": {
            loadCalendar: (event: {year?: number, month?: number, type: {module: 'year' | 'month', action?: 'previous' | 'next'}}) => Promise<CurrentDateCalendar>;
            addEvent: (event: DateEvent) => Promise<boolean | number[]>;
            getAllEvents: () => Promise<DateEvent[] | null>;
            getEventById: (eventId: number) => Promise<DateEvent | null>;
            updateEvent: (updatedEvent: Partial<DateEvent>) => Promise<boolean>;
            deleteEvent: (eventId: number) => Promise<boolean>;
            contextMenu: () => void;
            showEvent: (dateEvent: Date) => void;
            displayCreateEventPage: (action: 'create' | 'edit', eventId?: number) => void;
            onSendReloadEventDetail: (dateEvent: Date) => void;
            currentEventDetail: (callback: (res: ExtendedCurrentEvent) => void) => void;
            eventDetail: (callback: (res: DateEvent[]) => void) => void;
            sendDateEvent: (data: {year: number, month: number}) => void;
            onReloadCalendar: (callback: (res: {year: number, month: number}) => void) => void;
            closeEventsPage: () => void;
        }
    }
}