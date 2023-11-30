const monthElement = document.getElementById("month");
const yearElement = document.getElementById("year");
const columns = Array.from(document.querySelectorAll(".column"));

const months = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

let currentDate: {year: number, month: number}

function createCalendar(firstLoading: boolean, year?: number, month?: number): void {
  if (firstLoading) {
    const currentDate = new Date();
    // Obtenir la date actuelle
    year = currentDate.getFullYear(); // Récupérer l'année actuelle
    month = currentDate.getMonth() + 1; // Récupérer le mois actuel (le mois est indexé de 0 à 11)
    
    // Mise à jour des balises HTML avec le mois et l'année actuels
    monthElement.textContent = months[month - 1];
    yearElement.textContent = year.toString();
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

        if (i === 0 && j < firstDayOfMonth) {
          dayCell.textContent = '';
        } else if (dayCounter > daysInMonth) {
          dayCell.textContent = '';
        } else {
          dayCell.textContent = dayCounter.toString();
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
}