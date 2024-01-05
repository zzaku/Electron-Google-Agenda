// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.
const previousMonth = document.getElementById('prevMonth');
const nextMonth = document.getElementById('nextMonth')

const previousYear = document.getElementById('prevYear');
const nextYear = document.getElementById('nextYear');


//Initialisation du calendrier
(async function initializeCalendar (){
  await createCalendar(true);
  displayEventsOnCalendar();
 })();

//Action mois
previousMonth.addEventListener('click', () => {
  window.electron.loadCalendar({
    year: currentDate.year,
    month: currentDate.month,
    type: {
      module: 'month',
      action: 'previous'
    }})
  .then(async (res) => {
    await createCalendar(false, res.year, res.month);
    displayEventsOnCalendar();
  })
})

nextMonth.addEventListener('click', () => {
  window.electron.loadCalendar({
    year: currentDate.year,
    month: currentDate.month,
    type: {
      module: 'month',
      action: 'next'
    }})
  .then(async (res) => {
    await createCalendar(false, res.year, res.month);
    displayEventsOnCalendar();
  })
})

//Action Année
previousYear.addEventListener('click', () => {
  window.electron.loadCalendar({
    year: currentDate.year,
    month: currentDate.month,
    type: {
      module: 'year',
      action: 'previous'
    }})
  .then(async (res) => {
    await createCalendar(false, res.year, res.month);
    displayEventsOnCalendar();
  })
})

nextYear.addEventListener('click', () => {
  window.electron.loadCalendar({
    year: currentDate.year,
    month: currentDate.month,
    type: {
      module: 'year',
      action: 'next'
    }})
  .then(async (res) => {
    await createCalendar(false, res.year, res.month);
    displayEventsOnCalendar();
  })
});

window.electron.onReloadCalendar(async (res: { year: number, month: number }) => {
  const { year, month } = res;

  // Utilisation de year et month pour recharger le calendrier avec les nouvelles données
  await createCalendar(false, year, month);
  displayEventsOnCalendar();
});