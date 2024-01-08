const monthElement = document.getElementById("month");
const yearElement = document.getElementById("year");
const columns = Array.from(document.querySelectorAll(".column"));

const exportBtn = document.getElementById("export-btn");
const confirmExport: HTMLElement = document.querySelector(".confirm-export");

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

exportBtn.addEventListener('click', () => {
  const selectCircles: NodeListOf<HTMLElement> = document.querySelectorAll(".circle");
  

  isExportingMode = !isExportingMode;
  if (isExportingMode) {
    const dayCells: NodeListOf<HTMLElement> = document.querySelectorAll(".dayy__cell");

    selectCircles.forEach(selectCircle => selectCircle.style.display = "block");
    
    checkInputs();

    dayCells.forEach((elem: HTMLElement) => elem.classList.remove("cliackable"));
    } else {
      const dayCells: NodeListOf<HTMLElement> = document.querySelectorAll(".dayy__cell");

      selectCircles.forEach(selectCircle => selectCircle.style.display = "none");

      dayCells.forEach((elem: HTMLElement) => elem.classList.add("cliackable"));
    }
    
  });

  confirmExport.addEventListener("click", () => confirmExportOfEvent());

  const handleClickInput = (inputInsideCell: HTMLInputElement) => {
    if(isExportingMode){
      if(inputInsideCell){
        inputInsideCell.checked = !inputInsideCell.checked;
      }
    }
  }

  function checkInputs(): void {
    const selectCircles: NodeListOf<HTMLInputElement> = document.querySelectorAll('.circle');
  
    let isAnyChecked = false;

    selectCircles.forEach(selectCircle => {
      selectCircle.addEventListener("change", () => {
        checkSelected(isAnyChecked, confirmExport, selectCircles);
      })
      isAnyChecked = Array.from(selectCircles).some(circle => circle.checked);
      checkSelected(isAnyChecked, confirmExport, selectCircles);
    });
  }

  const checkSelected = (isSelected: boolean, btn: HTMLElement, selectCircles: NodeListOf<HTMLInputElement>): void => {
    isSelected = Array.from(selectCircles).some(circle => circle.checked);

    if (isSelected) {
      btn.style.display = 'block';
    } else {
      btn.style.display = 'none';
    }
  }

  const confirmExportOfEvent = async (): Promise<void> => {
    const inputsSelect: HTMLInputElement[] = Array.from(document.querySelectorAll('.circle'));

    const selectedEvents: EventICS[] = [];

    for (const input of inputsSelect) {
      if(input.checked){
        const attr = input.getAttributeNames()
        const idsAttr = attr.slice(2, attr.length - 1);
        const ids = idsAttr.map(idAttr => parseInt(idAttr.split('-')[idAttr.split('-').length - 1]));

        for (const id of ids) {
          const event = await window.electron.getEventById(id);
          if (event) {
            const formattedEvent: EventICS = {
              dtStart: event.date_deb.toISOString().replace(/-|:|\.\d+/g, "").slice(0, -1) + 'Z',
              dtEnd: event.date_fin.toISOString().replace(/-|:|\.\d+/g, "").slice(0, -1) + 'Z',
              summary: event.titre,
              location: event.location,
              description: event.description,
              categorie: event.categorie,
              prodId: '-//Schedulo//EN',
              transp: event.transparence || '',
              status: event.statut || '',
            };
  
            selectedEvents.push(formattedEvent);
          }
        }
      }
    }

    for (const input of inputsSelect) {
      input.checked = false;
      exportBtn.click();
      checkInputs();
    }

    const icsContent = generateICSFile(selectedEvents);
    const encodedICSContent = encodeURIComponent(icsContent);
    const calendarURLFile = `data:text/calendar;charset=utf-8,${encodedICSContent}`;


    
    window.location.href = calendarURLFile;
  }

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

          dayCell.classList.add("dayy__cell");
          dayCell.classList.add("cliackable");

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

            if (isExportingMode) {
              dayCell.removeEventListener("click", () => handleClickSelectEvent(year, month, dayCounter));
            } else {
              dayCell.addEventListener("click", () => handleClickSelectEvent(year, month, dayCounter));
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

      const cell: HTMLElement = document.querySelector(`.dates-table td[data-day="${day}"][data-month="${month}"][data-year="${year}"]`);

      if (!processedDates[dateString]) {
        processedDates[dateString] = true; // Marquer la date comme traitée
        
        // Récupérer la cellule correspondant à la date de l'événement
        
        if (cell) {
          const dayCell: NodeListOf<HTMLElement> = document.querySelectorAll(".dayy__cell");

          createInputExport(cell, event.id);

          const eventTitle = document.createElement('div');
          const span = document.createElement('span');

          eventTitle.classList.add('event__tag');

          span.setAttribute('id', 'event-count');
          span.setAttribute('data-day', day.toString());
          span.setAttribute('data-month', month.toString());
          span.setAttribute('data-year', year.toString());

          span.textContent = eventCounts[dateString].toString();

          const handleClickShowEvent = () => {
            if (!isExportingMode) {
              console.log(event.date_deb)
              window.electron.showEvent(event.date_deb);
            }
          };

          dayCell.forEach(elem => {console.log(elem);elem.removeEventListener("click", () => handleClickSelectEvent())})

          if (isExportingMode) {
            eventTitle.removeEventListener("click", handleClickShowEvent);
          } else {
            eventTitle.addEventListener("click", handleClickShowEvent);
          }

          eventTitle.appendChild(span);
          cell.appendChild(eventTitle);
        }
      } else {
        const eventCountSpan = document.querySelector(`#event-count[data-day="${day}"][data-month="${month}"][data-year="${year}"]`);
        const cellInput = cell.querySelector(".circle");

        cellInput.setAttribute(`data-event-${event.id}`, event.id.toString());

        eventCountSpan.textContent = eventCounts[dateString].toString();
      }
    });
  }

  const eventsTag: NodeListOf<HTMLElement> = document.querySelectorAll(".event__tag");

  eventsTag.forEach(eventTag => {
      const inputInsideCell: HTMLInputElement = eventTag.previousElementSibling as HTMLInputElement;

      eventTag.addEventListener("click", () => {
        handleClickInput(inputInsideCell);
        checkInputs();
      });
  });
};

const handleClickSelectEvent = (year?: number, month?: number, dayCounter?: number) => {
  const newDate = new Date(year, month, dayCounter);
  if (!isExportingMode) {
    selectDateRange(newDate);
  }
};

const createInputExport = (cell: HTMLElement, eventId: number) => {
  const selectCircle = document.createElement('input');

  selectCircle.classList.add("circle");
  selectCircle.setAttribute("type", "checkbox");
  selectCircle.setAttribute(`data-event-${eventId}`, eventId.toString());
  
  cell.appendChild(selectCircle);
  
}

const selectDateRange = (dateDeb: Date): void => {
  if(!isExportingMode){
    window.electron.displayCreateEventPage("create", null, dateDeb);
  }
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

\n\n`;
});

  icsContent += `END:VCALENDAR\n`;

  return icsContent;
};