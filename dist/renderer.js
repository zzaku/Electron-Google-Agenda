// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.
var ipcRenderer = require('electron').ipcRenderer;
var calendar = require('./dist/features/calendar');
//import { createCalendar } from "../dist/features/calendar";
ipcRenderer.on('loadCalendar', function (event, currentDate) {
    var year = currentDate.year, month = currentDate.month;
    calendar.createCalendar(year, month);
});
ipcRenderer.send('getCurrentDate');
var test = {
    date_deb: new Date(Date.now()),
    date_fin: new Date(Date.now()),
    titre: "test"
};
ipcRenderer.send('addEvent', test);
//# sourceMappingURL=renderer.js.map