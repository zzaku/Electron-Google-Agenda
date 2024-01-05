const dateTitle= document.getElementById('date-title');

window.electron.eventDetail((events) => {
  //Supression des évènement pour le rafraichissment
    const container = Array.from(document.querySelectorAll("#hour-event-container"));

    container.map(elem => elem.remove());
    
    //Affichage des informations des évènements
    events.map(async (event, i) => {
      const eventDate = new Date(event.date_deb);
      
      const dateFormatted = new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'long',
      }).format(eventDate);
  
      const hour = new Intl.DateTimeFormat('fr-FR', {
        timeStyle: 'short',
      }).format(eventDate);
  
      const eventTitle = event.titre;
      const eventDescription = event.description;
      
      dateTitle.innerText = `${dateFormatted}`;
  
      await displayEvent(i);

      const hourContainer= document.querySelector<HTMLElement>(`#hour-container[event="${i}"]`);
      const titleContainer= document.querySelector<HTMLElement>(`#title-container[event="${i}"]`);
  
      const hourElement = document.querySelector<HTMLElement>(`#hour[event="${i}"]`);
      const titleElement = document.querySelector<HTMLElement>(`#title[event="${i}"]`);
      const descriptionElement = document.querySelector<HTMLElement>(`#description[event="${i}"]`);

      const gradient1 = generateGradient("#5472E4", "#202248", events.length, i)[0];
      const gradient2 = generateGradient("#D6E1FF", "#202248", events.length, i)[0];
      const gradient3 = generateGradient("#202248", "#000000", events.length, i)[0];

      if(i !== 0){
        hourContainer.style.backgroundColor = gradient1;
        titleContainer.style.backgroundColor = gradient2;
        descriptionElement.style.color = gradient3;
      }
      
      const deleteBtn = createDeleteButton();
      const editBtn = createEditButton();

      deleteBtn.addEventListener('click', () => {
        displayDeleteConfirmation(event.id, event.date_deb, event.titre);
      });

      deleteBtn.addEventListener("mouseover", () => editBtn.style.right = "8em");
      deleteBtn.addEventListener("mouseout", () => editBtn.style.right = "4em");

      editBtn.addEventListener('click', () => {
        window.electron.displayCreateEventPage("edit", event.id);
      });

      titleContainer.appendChild(deleteBtn);
      titleContainer.appendChild(editBtn);
  
      hourElement.innerText = hour;
      titleElement.innerText = eventTitle;
      descriptionElement.innerText = eventDescription;
    })
  });

// Créer le bouton de suppression
const createDeleteButton = (): HTMLButtonElement => {
  const deleteButton: HTMLButtonElement = document.createElement('button');
  deleteButton.classList.add('delete-button');

  const deleteIcon: SVGElement = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
  deleteIcon.classList.add('delete-svgIcon');
  deleteIcon.setAttribute('viewBox', '0 0 448 512');

  const groupElement = document.createElementNS("http://www.w3.org/2000/svg", 'g');
  groupElement.setAttribute('fill', 'rgb(255, 69, 69)');

  const path1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
  path1.setAttribute('d', 'M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z');

  groupElement.appendChild(path1);

  deleteIcon.appendChild(groupElement);
  
  deleteButton.appendChild(deleteIcon);
  
  return deleteButton;
};

// Créer le bouton de modification
const createEditButton = (): HTMLButtonElement => {
  const editButton: HTMLButtonElement = document.createElement('button');
  editButton.classList.add('edit-button');

  const editIcon = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
  editIcon.classList.add('edit-svgIcon');
  editIcon.setAttribute('viewBox', '0 0 512 512');

  const groupElement = document.createElementNS("http://www.w3.org/2000/svg", 'g');
  groupElement.setAttribute('fill', 'rgb(210, 187, 253)');

  const pathElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
  pathElement.setAttribute('d', 'M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z');

  groupElement.appendChild(pathElement);

  editIcon.appendChild(groupElement);

  editButton.appendChild(editIcon);

  return editButton;
};

const displayDeleteConfirmation = (id: number, dateDeb: Date, title: string): void => {
  const eventsContainer: HTMLElement = document.getElementById("events__container");

  // Création des éléments
  const card: HTMLDivElement = document.createElement('div');
  card.classList.add('card');

  const cardContent = document.createElement('div');
  cardContent.classList.add('card-content');

  const cardHeading = document.createElement('p');
  cardHeading.classList.add('card-heading');
  cardHeading.textContent = `Supression de l'évènement ${id} - ${title}`;

  const cardDescription = document.createElement('p');
  cardDescription.classList.add('card-description');
  cardDescription.textContent = "Etes-vous sûr de vouloir supprimer cet évènement ?";

  const cardButtonWrapper = document.createElement('div');
  cardButtonWrapper.classList.add('card-button-wrapper');

  const cancelButton = document.createElement('button');
  cancelButton.classList.add('card-button', 'secondary');
  cancelButton.textContent = 'Cancel';

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('card-button', 'primary');
  deleteButton.textContent = 'Delete';

  const exitButton = document.createElement('button');
  exitButton.classList.add('exit-button');

  const exitSvg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
  exitSvg.setAttribute('height', '20px');
  exitSvg.setAttribute('viewBox', '0 0 384 512');

  const exitPath = document.createElementNS("http://www.w3.org/2000/svg", 'path');
  exitPath.setAttribute(
    'd',
    'M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z'
  );

  // Ajout des éléments dans la structure
  exitSvg.appendChild(exitPath);
  exitButton.appendChild(exitSvg);
  
  cardContent.appendChild(cardHeading);
  cardContent.appendChild(cardDescription);
  
  cardButtonWrapper.appendChild(cancelButton);
  cardButtonWrapper.appendChild(deleteButton);
  
  card.appendChild(cardContent);
  card.appendChild(cardButtonWrapper);
  card.appendChild(exitButton);

  eventsContainer.appendChild(card);

  //onCancel
  cancelButton.addEventListener("click", () => cancelConfirmation(card))
  exitButton.addEventListener("click", () => cancelConfirmation(card))

  //onDelete
  deleteButton.addEventListener("click", () => {
    deleteEvent(id, dateDeb, title, eventsContainer);
    cancelConfirmation(card);
  })

}

const cancelConfirmation = (card: HTMLDivElement): void => {
    card.classList.add('fade-out');

    card.addEventListener('animationend', () => {
      card.remove();
    });
}

const deleteEvent = (id: number, dateDeb: Date, title: string, parent: HTMLElement): void => {
  window.electron.deleteEvent(id)
  .then(res => {
    if(res){
      const eventDate = new Date(dateDeb);
      const container = Array.from(document.querySelectorAll("#hour-event-container"));

      createToaster('delete', id, title, parent);
      
      window.electron.onSendReloadEventDetail(dateDeb);

      if(container.length === 1){
        window.electron.sendDateEvent({year: eventDate.getFullYear(), month: eventDate.getMonth() + 1});
        window.electron.closeEventsPage();
      }
    }
  })
}