const titlePage: HTMLElement = document.getElementById("title");

const dateDeb = (document.getElementById('dateDeb') as HTMLInputElement);
const dateFin = (document.getElementById('dateFin') as HTMLInputElement);
const titre = (document.getElementById('titre') as HTMLInputElement);
const localisation = (document.getElementById('location') as HTMLInputElement);
const categorie = (document.getElementById('categorie') as HTMLInputElement);
const description = (document.getElementById('description') as HTMLTextAreaElement);
const statut = Array.from(document.querySelectorAll<HTMLInputElement>('.statut input[type="radio"]'));
const transparence = Array.from(document.querySelectorAll<HTMLInputElement>('.transparence input[type="radio"]'));
const submitBtn: HTMLElement = document.getElementById("submit-btn");

let selectedTransparence: HTMLInputElement;
let selectedStatut: HTMLInputElement;

transparence[0].checked = true;
statut[0].checked = true;

transparence.forEach(option => {
    option.addEventListener('change', () => {
      if (option.checked) {
        selectedTransparence = option;
        }
    });
});

statut.forEach(option => {
    option.addEventListener('change', () => {
        if (option.checked) {
            selectedStatut = option
      }
    });
  });

window.electron.currentEventDetail((myEvent) => {
    if(myEvent.action === "edit"){
        titlePage.innerText = "Modifiez votre évènement";
        submitBtn.innerText = "Modifier l'événement";
        dateDeb.value = formatDateToInputValue(myEvent.date_deb);
        dateFin.value = formatDateToInputValue(myEvent.date_fin);
        titre.value = myEvent.titre;
        localisation.value = myEvent.location;
        categorie.value = myEvent.categorie;
        description.value = myEvent.description;
    
        transparence.forEach(option => {
            if (option.attributes.getNamedItem("data-txt").value === myEvent.transparence) {
                option.checked = true;
            }
        });
        
        statut.forEach(option => {
            if (option.attributes.getNamedItem("data-txt").value === myEvent.statut) {
                option.checked = true;
            }
          });

    } else if(myEvent.action === 'create'){
        titlePage.innerText = "Créer un nouvel événement";
        submitBtn.innerText = "Créer l'événement";
        if(myEvent.date_deb){
            dateDeb.value = formatDateToInputValue(myEvent.date_deb);
        }
    }

    //Submit form
    const form = document.getElementById('eventForm');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
        
            const eventDateDeb = new Date(dateDeb.value);
            const eventDateFin = new Date(dateFin.value);
        
            const dataEvent = {
                id: myEvent.action === 'edit' ? myEvent.id : undefined,
                date_deb: eventDateDeb,
                date_fin: eventDateFin,
                titre: titre.value,
                location: localisation.value,
                categorie: categorie.value,
                description: description.value,
                statut: selectedStatut?.attributes.getNamedItem("data-txt").value,
                transparence: selectedTransparence?.attributes.getNamedItem("data-txt").value,
            };

            const event: EventICS = {
                dtStart: eventDateDeb.toISOString().replace(/-|:|\.\d+/g, "").slice(0, -1) + 'Z',
                dtEnd: eventDateFin.toISOString().replace(/-|:|\.\d+/g, "").slice(0, -1) + 'Z',
                summary: titre.value,
                location: localisation.value,
                description: description.value,
                categorie: categorie.value,
                prodId: '-//Schedulo//EN',
                transp: selectedTransparence?.attributes.getNamedItem("data-txt").value || '',
                status: selectedStatut?.attributes.getNamedItem("data-txt").value || '',
            };

            const icsContent = generateICSLink(event);
            const encodedICSContent = encodeURIComponent(icsContent);
            const calendarURLFile = `data:text/calendar;charset=utf-8,${encodedICSContent}`;
            const calendarURL = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.summary)}&dates=${encodeURIComponent(event.dtStart)}/${encodeURIComponent(event.dtEnd)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}&status=${encodeURIComponent(event.status)}&transp=${encodeURIComponent(event.transp)}&categories=${encodeURIComponent(event.categorie)}`;

            window.location.href = calendarURLFile;
            
            window.location.href = calendarURL;

            if(myEvent.action === 'create') {
                window.electron.addEvent(dataEvent)
                .then(async (res: boolean | number[]) => {
                    if(res && Array.isArray(res)){
                        const id = res[0]

                        //Clear les input
                        clearInput();
            
                        //Affichage de la notifiaction
                        const formContainer = document.getElementById("form__container");
            
                        createToaster('create', id,  titre.value, formContainer);
            
                        //reload calendar and events
                        window.electron.onSendReloadEventDetail(eventDateDeb);
                    }
                        window.electron.sendDateEvent({year: eventDateDeb.getFullYear(), month: eventDateDeb.getMonth() + 1});
                });
            } else if (myEvent.action === 'edit'){
                window.electron.updateEvent(dataEvent)
                .then(async (res: boolean | number) => {
                    if(res){
                        //Affichage de la notifiaction
                        const formContainer = document.getElementById("form__container");
            
                        createToaster('edit', myEvent.id,  titre.value, formContainer);
            
                        //reload calendar and events
                        window.electron.onSendReloadEventDetail(eventDateDeb);
                        window.electron.sendDateEvent({year: eventDateDeb.getFullYear(), month: eventDateDeb.getMonth() + 1});
                    }
                });
            }
        });
    }
})

const formatDateToInputValue = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
  
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

const clearInput = (): void => {
    dateDeb.value = null;
    dateFin.value = null;
    titre.value = null;
    localisation.value = null;
    categorie.value = null
    description.value = null;
    
    transparence.forEach(option => {
        if (option.id === "Publique") {
            option.checked = true;
        } else {
            option.checked = false;
        }
    });
    
    statut.forEach(option => {
        if (option.id === "En_cours") {
            option.checked = true;
        } else {
            option.checked = false;
        }
      });
}
  
const generateICSLink = (eventDetails: EventICS): string => {
    // ... Vos autres champs
    const { dtStart, dtEnd, summary, location, description, prodId, transp, status, categorie } = eventDetails;

    const formattedICS = `
        BEGIN:VCALENDAR
        VERSION:2.0
        PRODID:${prodId}
        BEGIN:VEVENT
        DTSTART:${formatDateToICSFormat(dtStart)}
        DTEND:${formatDateToICSFormat(dtEnd)}
        SUMMARY:${summary}
        LOCATION:${location}
        DESCRIPTION:${description}
        TRANSP:${transp}
        STATUS:${status}
        CATEGORIES:${categorie}
        END:VEVENT
        END:VCALENDAR
    `.trim();

    return formattedICS
};


const formatDateToICSFormat = (date: string): string => {
    const year = date.substring(0, 4);
    const month = date.substring(4, 6);
    const day = date.substring(6, 8);
    const hours = date.substring(9, 11);
    const minutes = date.substring(11, 13);

    return `${year}${month}${day}T${hours}${minutes}00Z`;
};
  
interface EventICS {
    dtStart: string;
    dtEnd: string;
    summary: string;
    location: string;
    description: string;
    prodId: string;
    transp: string;
    status: string;
    categorie: string; 
}
