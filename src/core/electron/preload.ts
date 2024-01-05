// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
import { contextBridge, ipcRenderer } from 'electron'
import { DateEvent } from '../models/event.interfaces'
import { ExtendedCurrentEvent } from '../models/currentEvent';

contextBridge.exposeInMainWorld(
  'electron',
  {
    loadCalendar: (event: {year?: number, month?: number, type: {module: 'year' | 'month', action?: 'previous' | 'next'}}) => ipcRenderer.invoke('getDate', event),
    addEvent: (event: DateEvent) => ipcRenderer.invoke('add-event', event),
    getAllEvents: () => ipcRenderer.invoke('get-event'),
    getEventById: (eventId: number) => ipcRenderer.invoke('get-event-by-id', eventId),
    updateEvent: (event: Partial<DateEvent>) => ipcRenderer.invoke('update-event', event),
    deleteEvent: (eventId: number) => ipcRenderer.invoke('delete-event', eventId),
    contextMenu: () => ipcRenderer.invoke('show-context-menu'),
    showEvent: (dateEvent: Date) => ipcRenderer.invoke('show-event', dateEvent),
    displayCreateEventPage: (action: 'create' | 'edit', eventId?: number) => ipcRenderer.invoke('display-create-event-page', action, eventId),
    onSendReloadEventDetail: (dateEvent: Date) => onSendReloadEventDetail(dateEvent),
    currentEventDetail: (callback: (res: ExtendedCurrentEvent) => void) => currentEventDetail(callback),
    eventDetail: (callback: (res: DateEvent[]) => void) => eventDetail(callback),
    sendDateEvent: (data: {year: number, month: number}) => sendDateEvent(data),
    onReloadCalendar: (callback: (res: {year: number, month: number}) => void) => onReloadCalendar(callback),
    closeEventsPage: () => ipcRenderer.send("close-events-page"),
  }
)

function currentEventDetail(callback: (res: ExtendedCurrentEvent) => void): void {
  ipcRenderer.on("edit-page-event", (event, response: ExtendedCurrentEvent) => {
    callback(response);
  });
}

function eventDetail(callback: (res: DateEvent[]) => void): void {
  ipcRenderer.on("display-event", (event, response: DateEvent[]) => {
    callback(response);
  });
}

async function onSendReloadEventDetail(dateEvent: Date): Promise<void> {
  let eventsReloaded: DateEvent[];

  ipcRenderer.send("reload-events-page", eventsReloaded, dateEvent)
}

function sendDateEvent(data: {year: number, month: number}): void {
  ipcRenderer.send("reload", data)
}

function onReloadCalendar(callback: (res: {year: number, month: number}) => void): void {
  ipcRenderer.on("reload-calendar", (event, response: {year: number, month: number}) => {
    callback(response);
  });
}