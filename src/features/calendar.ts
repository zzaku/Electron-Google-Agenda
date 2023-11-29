const monthElement = document.getElementById("month");
const yearElement = document.getElementById("year");

const months = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

const currentDate = new Date();
const currentMonth = currentDate.getMonth();
const currentYear = currentDate.getFullYear();

monthElement.textContent = months[currentMonth];
yearElement.textContent = currentYear.toString();

function createCalendar(year: number, month: number): void {
  console.log(`Year: ${year}, Month: ${month}`);
}

export { createCalendar };
