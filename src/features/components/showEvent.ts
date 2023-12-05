
  const titleElement = document.getElementById('title');
  const descriptionElement = document.getElementById('description');

  window.electron.eventDetail((event) => {
    
    titleElement.textContent = event.titre;
    descriptionElement.textContent = event.description;
    
  });
