const displayEvent = (index: number) => {
    return new Promise((resolve, reject) => {
        const eventDetails: HTMLElement = document.getElementById("event-details-container");
        
        if (!eventDetails) {
            reject("Aucun élément avec la classe 'event-details-container' trouvé.");
            return;
        }

        const hourEventContainer = document.createElement('div');

        hourEventContainer.setAttribute('id', 'hour-event-container');
        hourEventContainer.setAttribute("event", index.toString());
        
        const hourContainer = document.createElement('div');

        hourContainer.id = 'hour-container';
        hourContainer.setAttribute("event", index.toString());
        
        const hourTitle = document.createElement('h3');

        hourTitle.id = 'hour';
        hourTitle.setAttribute("event", index.toString());

        hourContainer.appendChild(hourTitle);
        
        const titleContainer = document.createElement('div');

        titleContainer.id = 'title-container';
        titleContainer.setAttribute("event", index.toString());
        
        const title = document.createElement('h4');

        title.id = 'title';
        title.setAttribute("event", index.toString());
        
        const description = document.createElement('h5');

        description.id = 'description';
        description.setAttribute("event", index.toString());
        
        titleContainer.appendChild(title);
        titleContainer.appendChild(description);
        
        hourEventContainer.appendChild(hourContainer);
        hourEventContainer.appendChild(titleContainer);
        
        eventDetails.appendChild(hourEventContainer);
        
        resolve("Événement affiché avec succès !");
    });
};

function generateGradient(startColor: string, endColor: string, steps: number, i: number) {
    // Convertir la couleur hexadécimale en valeurs RVB
    const hexToRgb = (hex: string) => hex.match(/[A-Za-z0-9]{2}/g).map((v) => parseInt(v, 16));
    const [startR, startG, startB] = hexToRgb(startColor);
    const [endR, endG, endB] = hexToRgb(endColor);

    // Calculer les incréments pour chaque composante RVB
    const rStep = (endR - startR) / steps;
    const gStep = (endG - startG) / steps;
    const bStep = (endB - startB) / steps;

    const gradientColors = [];

    // Générer la couleurs du dégradé
    const newR = Math.floor(startR + i /1.2 * rStep);
    const newG = Math.floor(startG + i /1.2 * gStep);
    const newB = Math.floor(startB + i /1.2 * bStep);
    const newColor = `rgb(${newR}, ${newG}, ${newB})`;
    
    gradientColors.push(newColor);

    return gradientColors;
}
