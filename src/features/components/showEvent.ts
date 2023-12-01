
window.addEventListener('DOMContentLoaded', () => {
  const titleElement = document.getElementById('title');
  const descriptionElement = document.getElementById('description');

   console.log(window.electron.eventDetail());
      // titleElement.textContent = eventDetails.title;
      // descriptionElement.textContent = eventDetails.description;
});
