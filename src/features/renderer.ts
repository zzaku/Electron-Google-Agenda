// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.
const previousMonth = document.getElementById('prevMonth');
const nextMonth = document.getElementById('nextMonth')

const previousYear = document.getElementById('prevYear')
const nextYear = document.getElementById('nextYear')

//Initialisation du calendrier
createCalendar(true);

//Action mois
previousMonth.addEventListener('click', () => window.electron.loadCalendar({year: currentDate.year,month: currentDate.month, type: {module: 'month', action: 'previous'}}).then((res) => {createCalendar(false, res.year, res.month)}))
nextMonth.addEventListener('click', () => window.electron.loadCalendar({year: currentDate.year, month: currentDate.month,  type: {module: 'month', action: 'next'}}).then((res) => {createCalendar(false, res.year, res.month)}))

//Action Année
previousYear.addEventListener('click', () => window.electron.loadCalendar({year: currentDate.year, month: currentDate.month, type: {module: 'year', action: 'previous'}}).then((res) => {createCalendar(false, res.year, res.month)}))
nextYear.addEventListener('click', () => window.electron.loadCalendar({year: currentDate.year, month: currentDate.month, type: {module: 'year', action: 'next'}}).then((res) => {createCalendar(false, res.year, res.month)}))

const test = {
  date_deb: new Date(Date.now()),
  date_fin: new Date(Date.now()),
  titre: "test"
};

(async function testAddEvent  (){
  await window.electron.addEvent(test);
})();
