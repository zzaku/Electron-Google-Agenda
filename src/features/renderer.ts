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
previousMonth.addEventListener('click', () => window.electron.loadCalendar({year: currentDate.year,month: currentDate.month, type: {module: 'month', action: 'previous'}})
.then(async (res) => {
  await createCalendar(false, res.year, res.month)
  displayEventsOnCalendar();
}))

nextMonth.addEventListener('click', () => window.electron.loadCalendar({year: currentDate.year, month: currentDate.month,  type: {module: 'month', action: 'next'}})
.then(async (res) => {
  await createCalendar(false, res.year, res.month)
  displayEventsOnCalendar();
}))

//Action Année
previousYear.addEventListener('click', () => window.electron.loadCalendar({year: currentDate.year, month: currentDate.month, type: {module: 'year', action: 'previous'}})
.then(async (res) => {
  await createCalendar(false, res.year, res.month)
  displayEventsOnCalendar();
}))

nextYear.addEventListener('click', () => window.electron.loadCalendar({year: currentDate.year, month: currentDate.month, type: {module: 'year', action: 'next'}})
.then(async (res) => {
  await createCalendar(false, res.year, res.month)
  displayEventsOnCalendar();
}))


// récupérer tous les évenements de la db
const getAllEventsFromDB = async () => {
  return await window.electron.getAllEvents();
};

const displayEventsOnCalendar = async () => {
  //récuprération des évènements
  const events = await getAllEventsFromDB();

  if (events) {
    // Parcour les événements pour afficher les événement sur le bon jour
    events.forEach((event) => {
      const eventDate = new Date(event.date_deb);
      const day = eventDate.getDate();
      const month = eventDate.getMonth() + 1;
      const year = eventDate.getFullYear();
      // Récupère la cellule correspondant à la date de l'événement
      const cell = document.querySelector(`.dates-table td[data-day="${day}"][data-month="${month}"][data-year="${year}"]`);

      if (cell) {
        // Créer un élément pour afficher le titre de l'événement
        const eventTitle = document.createElement('div');
        eventTitle.className = 'event__tag'
        eventTitle.textContent = event.titre.length >= 17 ? event.titre.substring(0, 14) + '...' : event.titre;

        cell.appendChild(eventTitle);
      }
    });
  }
};

displayEventsOnCalendar();

 /*const test = {
  date_deb: new Date(Date.now()),
   date_fin: new Date(Date.now()),
  titre: "ceci est un titre d'évènement de test"
 };

(async function testAddEvent  (){
  await window.electron.addEvent(test);
 })();
*/