const titlePage: HTMLElement = document.getElementById("title");

const dateDeb = (document.getElementById('dateDeb') as HTMLInputElement);
const dateFin = (document.getElementById('dateFin') as HTMLInputElement);
const titre = (document.getElementById('titre') as HTMLInputElement);
const localisation = (document.getElementById('location') as HTMLInputElement);
const categorie = (document.getElementById('categorie') as HTMLInputElement);
const description = (document.getElementById('description') as HTMLTextAreaElement);
const statut = (document.getElementById('statut') as HTMLSelectElement);
const transparence = (document.getElementById('transparence') as HTMLSelectElement);

window.electron.currentEventDetail((myEvent) => {
    if(myEvent.action === "edit"){
        console.log()
        titlePage.innerText = "Modifiez votre évènement";
        dateDeb.value = formatDateToInputValue(myEvent.date_deb);
        dateFin.value = formatDateToInputValue(myEvent.date_fin);
        titre.value = myEvent.titre;
        localisation.value = myEvent.location;
        categorie.value = myEvent.categorie;
        description.value = myEvent.description;
        statut.value = myEvent.statut;
        transparence.value = myEvent.transparence;
    } else if(myEvent.action === 'create'){
        titlePage.innerText = "Créer un nouvel événement";
    }

    //Submit form
    const form = document.getElementById('eventForm');
    
    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
        
            const eventDateDeb = new Date(dateDeb.value);
            const eventDateFin = new Date(dateFin.value);
        
            const dataEvent = {
                id: myEvent.action === 'edit' ? myEvent.id : undefined,
                date_deb: eventDateDeb,
                date_fin: eventDateFin,
                titre: titre.value,
                location: localisation.value,
                categorie: categorie.value,
                statut: statut.value,
                description: description.value,
                transparence: transparence.value,
            };

            if(myEvent.action === 'create') {
                window.electron.addEvent(dataEvent)
                .then(async (res: boolean | number[]) => {
                    if(res && Array.isArray(res)){
                        const id = res[0]
            
                        //Affichage de la notifiaction
                        const formContainer = document.getElementById("form__container");
            
                        createToaster('create', id,  titre.value, formContainer);
            
                        //reload calendar and events
                        window.electron.onSendReloadEventDetail(eventDateDeb);
                        window.electron.sendDateEvent({year: eventDateDeb.getFullYear(), month: eventDateDeb.getMonth() + 1});
                    }
                });
            } else if (myEvent.action === 'edit'){
                window.electron.updateEvent(dataEvent)
                .then(async (res: boolean | number) => {
                    console.log(res)
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

function formatDateToInputValue(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
  
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }