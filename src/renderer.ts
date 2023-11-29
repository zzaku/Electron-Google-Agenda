// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.
const { ipcRenderer } = require('electron');

ipcRenderer.on('loadCalendar', (event, currentDate) => {
  const { year, month } = currentDate;


const { calendar } = require('./dist/features/calendar');
  calendar.createCalendar(year, month);
});

ipcRenderer.send('getCurrentDate');

const test = {
  date_deb: new Date(Date.now()),
  date_fin: new Date(Date.now()),
  titre: "test"
};

ipcRenderer.send('addEvent', test);
