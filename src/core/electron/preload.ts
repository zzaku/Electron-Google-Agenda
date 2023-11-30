// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
import { contextBridge, ipcRenderer, IpcRenderer } from 'electron'
import { DateEvent } from '../models/event.interfaces'

contextBridge.exposeInMainWorld(
  'electron',
  {
    loadCalendar: (event: {year?: number, month?: number, type: {module: 'year' | 'month', action?: 'previous' | 'next'}}) => ipcRenderer.invoke('getCurrentDate', event),
    addEvent: (event: DateEvent) => ipcRenderer.invoke('add-event', event),
    getAllEvents: () => ipcRenderer.invoke('get-event'),
    getEventById: (eventId: number) => ipcRenderer.invoke('get-event-by-id', eventId),
    updateEvent: (event: Partial<DateEvent>) => ipcRenderer.invoke('update-event', event),
    deleteEvent: (eventId: number) => ipcRenderer.invoke('delete-event', eventId),
    contextMenu: () => ipcRenderer.invoke('show-context-menu')
  }
)

