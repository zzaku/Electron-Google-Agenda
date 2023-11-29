"use strict";
exports.__esModule = true;
exports.createCalendar = void 0;
var monthElement = document.getElementById("month");
var yearElement = document.getElementById("year");
var columns = Array.from(document.querySelectorAll(".column"));
var months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];
// Récupérer le mois et l'anée
var currentDate = new Date();
var currentMonth = currentDate.getMonth();
var currentYear = currentDate.getFullYear();
// Mise a jour des balises html
monthElement.textContent = months[currentMonth];
yearElement.textContent = currentYear.toString();
function createCalendar(year, month) {
    var daysOfWeek = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    // Boucle sur les colonnes pour créer le calendrier dans chaque colonne
    columns.forEach(function (column) {
        var datesTable = column.querySelector('.dates-table');
        if (!datesTable)
            return;
        // Efface le contenu précédent de la table
        datesTable.innerHTML = '';
        // Récupérer le nombre de jours dans le mois et le jour de la semaine du premier et dernier jour du mois
        var daysInMonth = new Date(year, month, 0).getDate();
        var firstDayOfMonth = new Date(year, month - 1, 1).getDay();
        var lastDayOfMonth = new Date(year, month, 0).getDay();
        var currentRow = null;
        var headerRow = document.createElement('tr');
        daysOfWeek.forEach(function (day) {
            var headerCell = document.createElement('th');
            headerCell.textContent = day;
            headerRow.appendChild(headerCell);
        });
        datesTable.appendChild(headerRow);
        var dayCounter = 1;
        var inMonth = false;
        for (var i = 0; i < 6; i++) {
            currentRow = document.createElement('tr');
            for (var j = 0; j < 7; j++) {
                var dayCell = document.createElement('td');
                if (i === 0 && j < firstDayOfMonth) {
                    dayCell.textContent = '';
                }
                else if (dayCounter > daysInMonth) {
                    dayCell.textContent = '';
                }
                else {
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
exports.createCalendar = createCalendar;
//# sourceMappingURL=calendar.js.map