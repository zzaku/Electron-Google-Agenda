const dateTitle= document.getElementById('date-title');

  window.electron.eventDetail((events) => {
    console.log(events)
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
      
  
      hourElement.innerText = hour;
      titleElement.innerText = eventTitle;
      descriptionElement.innerText = eventDescription;
    })
  });
