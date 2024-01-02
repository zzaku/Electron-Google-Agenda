import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  MenuItemConstructorOptions,
  IpcMainEvent,
} from "electron";
import { db } from "../loaders/loadCoreModule";

import * as path from "path";
import { DateEvent } from "../models/event.interfaces";
import { CurrentDateCalendar } from "../models/currentDateCalendar.interface";

//Zone de handle
const table = "events";
``;

ipcMain.handle(
  "add-event",
  async (event, params: DateEvent) =>
    await db.functions.addEvent(db.knex, table, params)
);
ipcMain.handle(
  "get-event",
  async () => await db.functions.getAllEvents(db.knex, table)
);
ipcMain.handle(
  "get-event-by-id",
  async (event, params: number) =>
    await db.functions.addEvent(db.knex, table, params)
);
ipcMain.handle(
  "update-event",
  async (event, params: Partial<DateEvent>) =>
    await db.functions.addEvent(db.knex, table, params)
);
ipcMain.handle(
  "delete-event",
  async (event, params: number) =>
    await db.functions.addEvent(db.knex, table, params)
);
ipcMain.handle("show-event", async (event, dateEvent: Date) => {
  await createWindowEvent(dateEvent);
});

//Zone déclaration menus
const templateMenu: MenuItemConstructorOptions[] = [
  {
    label: "Créer",
    submenu: [
      {
        label: "Créer un évènement",
        click: () => {
          createEventWindow();
        },
      },
      {
        type: "separator",
      },
      {
        label: "Fermer",
        role: "quit",
      },
    ],
  },
];

const menu = Menu.buildFromTemplate(templateMenu);

Menu.setApplicationMenu(menu);

ipcMain.handle("show-context-menu", async (event: IpcMainEvent) => {
  const win: BrowserWindow | null = BrowserWindow.fromWebContents(event.sender);

  if (win) {
    menu.popup({ window: win });
  }
});

ipcMain.handle(
  "getDate",
  (
    event: IpcMainEvent,
    option: {
      year?: number;
      month?: number;
      type: { module: "year" | "month"; action?: "previous" | "next" };
    }
  ): CurrentDateCalendar => {
    if (option.type.module === "month") {
      if (option.type.action === "previous") {
        return {
          year: option.month === 1 ? option.year - 1 : option.year,
          month: option.month === 1 ? 12 : option.month - 1,
        };
      } else if (option.type.action === "next") {
        return {
          year: option.month === 12 ? option.year + 1 : option.year,
          month: option.month === 12 ? 1 : option.month + 1,
        };
      } else {
        return { year: option.year, month: option.month };
      }
    } else if (option.type.module === "year") {
      if (option.type.action === "previous") {
        return { year: option.year - 1, month: option.month };
      } else if (option.type.action === "next") {
        return { year: option.year + 1, month: option.month };
      } else {
        return { year: option.year, month: option.month };
      }
    }
  }
);

// Create the browser window.
function createWindow() {
  const mainWindow = new BrowserWindow({
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    width: 1000,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../../../index.html"));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
}

// Create event window.
function createEventWindow() {
  const mainWindow = new BrowserWindow({
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
    },
    width: 800,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../../../createEvent.html"));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
}

async function createWindowEvent(dateEvent: Date) {
  const eventDetails = await db.functions.getEventByDate(db.knex, table, dateEvent);

  const mainWindow = new BrowserWindow({
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
    },
    width: 800,
  });

  mainWindow.loadFile(path.join(__dirname, "../../../showEvent.html"));
  
  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.webContents.send('display-event', eventDetails);
  });

  mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
