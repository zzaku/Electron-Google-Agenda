const monthElement = document.getElementById("month");
const yearElement = document.getElementById("year");
const exportBtn = document.getElementById("export-btn");
const columns = Array.from(document.querySelectorAll(".column"));

const months = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

let currentDate: {year: number, month: number};

let isExportingMode: boolean;

// récupérer tous les évenements de la db
const getAllEventsFromDB = async () => {
  return await window.electron.getAllEvents();
};

function createCalendar(firstLoading: boolean, year?: number, month?: number): Promise<null> {
  return new Promise((resolve, reject) => {
    if (firstLoading) {
      const currentDate = new Date();

      // Obtenir la date actuelle
      year = currentDate.getFullYear(); // Récupérer l'année actuelle
      month = currentDate.getMonth() + 1; // Récupérer le mois actuel (le mois est indexé de 0 à 11)
    }

    currentDate = {year, month};
    
    // Mise a jour des balises html
    monthElement.textContent = months[month - 1];
    yearElement.textContent = year.toString();

    const daysOfWeek = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

    // Boucle sur les colonnes pour créer le calendrier dans chaque colonne
    columns.forEach((column) => {
      const datesTable = column.querySelector('.dates-table');
      if (!datesTable) return;

        // Efface le contenu précédent de la table
        datesTable.innerHTML = '';

      // Récupérer le nombre de jours dans le mois et le jour de la semaine du premier et dernier jour du mois
      const daysInMonth = new Date(year, month, 0).getDate();
      const firstDayOfMonth = new Date(year, month - 1, 1).getDay();

      let currentRow: HTMLTableRowElement | null = null;

      const headerRow = document.createElement('tr');
      daysOfWeek.forEach(day => {
        const headerCell = document.createElement('th');
        headerCell.textContent = day;
        headerRow.appendChild(headerCell);
      });

      datesTable.appendChild(headerRow);

      let dayCounter = 1;
      let inMonth = false;

      for (let i = 0; i < 6; i++) {
        currentRow = document.createElement('tr');

        for (let j = 0; j < 7; j++) {
          const dayCell = document.createElement('td');

          dayCell.style.cursor = "pointer";

          if (i === 0 && j < firstDayOfMonth) {
            dayCell.textContent = '';
          } else if (dayCounter > daysInMonth) {
            dayCell.textContent = '';
          } else {
            dayCell.setAttribute('data-day', dayCounter.toString());
            dayCell.setAttribute('data-month', month.toString());
            dayCell.setAttribute('data-year', year.toString());

            const dayNumber = document.createElement('h4');

            dayNumber.textContent = dayCounter.toString();
            dayNumber.classList.add("day__number");

            dayCell.appendChild(dayNumber);

            const handleClick = () => {
              if (!isExportingMode) {
                selectDateRange(dayCell, );
              }
            };

            if (isExportingMode) {
              // Retirez l'événement de clic
              dayCell.removeEventListener("click", handleClick);
            } else {
              // Ajoutez l'événement de clic
              dayCell.addEventListener("click", handleClick);
            }

            dayCounter++;
            inMonth = true;
          }

          currentRow.appendChild(dayCell);
        }

        datesTable.appendChild(currentRow);

        if (!inMonth) {
          currentRow.style.display = 'none';
        }
      }
    });

    resolve(null);
  });
}

const displayEventsOnCalendar = async () => {
  //récuprération des évènements
  const events = await getAllEventsFromDB();
  
  const processedDates: { [key: string]: boolean } = {};
  
  if (events) {
    const eventCounts: { [key: string]: number } = {};

    // Parcour les événements pour afficher les événement sur le bon jour
    events.forEach((event) => {
      const eventDate = new Date(event.date_deb);

      const day = eventDate.getDate();
      const month = eventDate.getMonth() + 1;
      const year = eventDate.getFullYear();

      const dateString = `${day}-${month}-${year}`;

      if (!eventCounts[dateString]) {
        eventCounts[dateString] = 1;
      } else {
        eventCounts[dateString]++;
      }

      if (!processedDates[dateString]) {
        processedDates[dateString] = true; // Marquer la date comme traitée
        
        // Récupérer la cellule correspondant à la date de l'événement
        const cell: HTMLElement = document.querySelector(`.dates-table td[data-day="${day}"][data-month="${month}"][data-year="${year}"]`);

        
        if (cell) {
          createInputExport(cell, event.id);

          const eventTitle = document.createElement('div');
          const span = document.createElement('span');

          eventTitle.classList.add('event__tag');

          span.setAttribute('id', 'event-count');
          span.setAttribute('data-day', day.toString());
          span.setAttribute('data-month', month.toString());
          span.setAttribute('data-year', year.toString());

          span.textContent = eventCounts[dateString].toString();

          eventTitle.addEventListener('click', () => window.electron.showEvent(event.date_deb));

          eventTitle.appendChild(span);
          cell.appendChild(eventTitle);
        }
      } else {
        const eventCountSpan = document.querySelector(`#event-count[data-day="${day}"][data-month="${month}"][data-year="${year}"]`);

        eventCountSpan.textContent = eventCounts[dateString].toString();
      }
    });
  }
};

const createInputExport = (cell: HTMLElement, eventId: number) => {
  const selectCircle = document.createElement('input');

  selectCircle.classList.add("circle");
  selectCircle.setAttribute("type", "radio");
  selectCircle.setAttribute("data-event-id", eventId.toString());

  cell.appendChild(selectCircle);

    exportBtn.addEventListener('click', () => {
      isExportingMode = !isExportingMode;
      if (isExportingMode) {
        selectCircle.style.display = "block"
      } else {
        selectCircle.style.display = "none";
      }
    });
  }


const selectDateRange = (dayCell: HTMLElement): void => {
  if (dayCell.childElementCount > 1)return;

  const eventTitle = document.createElement('div');
  eventTitle.className = 'event__tag';

  dayCell.appendChild(eventTitle);
  window.electron.displayCreateEventPage('create');
}

const generateICSFile = (events: EventICS[]): string => {
  let icsContent = '';

  events.forEach(event => {
    icsContent += `
      BEGIN:VCALENDAR
      VERSION:2.0
      PRODID:-//Schedulo//EN
      BEGIN:VEVENT
      DTSTART:${event.dtStart}
      DTEND:${event.dtEnd}
      SUMMARY:${event.summary}
      LOCATION:${event.location}
      DESCRIPTION:${event.description}
      TRANSP:${event.transp}
      STATUS:${event.status}
      CATEGORIES:${event.categorie}
      END:VEVENT
      END:VCALENDAR
    `;
  });

  const encodedICS = encodeURIComponent(icsContent);
  const href = `data:text/calendar;charset=utf8,${encodedICS}`;

  return href;
};