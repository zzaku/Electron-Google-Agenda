// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.
const { db } = require('./dist/core/loadCoreModule');

const test = {
    date_deb: new Date(Date.now()),
    date_fin: new Date(Date.now()),
    titre: "test"
};

db.functions.addEvent(db.knex, 'events', test);