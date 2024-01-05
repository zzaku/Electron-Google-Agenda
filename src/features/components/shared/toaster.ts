const createToaster = (action: 'create' | 'edit' | 'delete', id: number, title: string, parent: HTMLElement): void => {
    // Création des éléments HTML avec leurs types
    const toasterContainer: HTMLDivElement = document.createElement('div');
    toasterContainer.classList.add('toaster-container');
  
    const successDiv: HTMLDivElement = document.createElement('div');
    successDiv.classList.add('success');
  
    const flexDiv: HTMLDivElement = document.createElement('div');
    flexDiv.classList.add('flex');
  
    const flexShrinkDiv: HTMLDivElement = document.createElement('div');
    flexShrinkDiv.classList.add('flex-shrink-0');
  
    const svg: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'succes-svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('viewBox', '0 0 20 20');
    svg.setAttribute('fill', 'currentColor');
    svg.setAttribute('aria-hidden', 'true');
  
    const path: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('fill-rule', 'evenodd');
    path.setAttribute('d', 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z');
    path.setAttribute('clip-rule', 'evenodd');
  
    svg.appendChild(path);
    flexShrinkDiv.appendChild(svg);
  
    const successPromptWrap: HTMLDivElement = document.createElement('div');
    successPromptWrap.classList.add('success-prompt-wrap');
  
    const successPromptHeading: HTMLParagraphElement = document.createElement('p');
    successPromptHeading.classList.add('success-prompt-heading');
    successPromptHeading.textContent = `${id} - ${title}`;
  
    const successPromptPrompt: HTMLDivElement = document.createElement('div');
    successPromptPrompt.classList.add('success-prompt-prompt');
  
    const successPromptP: HTMLParagraphElement = document.createElement('p');
    successPromptP.textContent = action === 'create' ? 'Evenement crée avec succès !' : action === 'edit' ? 'Evenement mis à jour avec succès !' : action === 'delete' && 'Evenement supprimé avec succès !';
  
    successPromptPrompt.appendChild(successPromptP);
  
    const successButtonContainer: HTMLDivElement = document.createElement('div');
    successButtonContainer.classList.add('success-button-container');
  
    const successButtonMain: HTMLButtonElement = document.createElement('button');
    successButtonMain.setAttribute('type', 'button');
    successButtonMain.classList.add('success-button-main');
    successButtonMain.textContent = 'Faire disparaître';
    
    successButtonMain.addEventListener("click", () => toasterContainer.remove());
    successButtonMain.addEventListener("mouseout", () => successButtonMain.style.backgroundColor = "#ECFDF5");

    if(action === "create" || action == "edit"){
        svg.style.color = "rgb(74 222 128)";
        successPromptHeading.style.color = "rgb(22 101 52)";
        successPromptPrompt.style.color = "rgb(21 128 61)";
        successButtonMain.style.color = "rgb(22 101 52)";
        successDiv.style.background = "rgb(240 253 244)"

        successButtonMain.addEventListener("mouseover", () => successButtonMain.style.backgroundColor = "#90ffc5");
    } else if(action === "delete"){
        svg.style.color = "rgb(255 115 115)";
        successPromptHeading.style.color = "rgb(179 2 2)";
        successPromptPrompt.style.color = "rgb(128 0 0)";
        successButtonMain.style.color = "rgb(179 2 2)";
        successDiv.style.background = "rgb(240 220 220)"
        
        successButtonMain.addEventListener("mouseover", () => successButtonMain.style.backgroundColor = "#ffa0a0");
    }
    
    successButtonContainer.appendChild(successButtonMain);
  
    successPromptWrap.appendChild(successPromptHeading);
    successPromptWrap.appendChild(successPromptPrompt);
    successPromptWrap.appendChild(successButtonContainer);
  
    flexDiv.appendChild(flexShrinkDiv);
    flexDiv.appendChild(successPromptWrap);
  
    successDiv.appendChild(flexDiv);
    toasterContainer.appendChild(successDiv);

    parent.appendChild(toasterContainer)

    setTimeout(() => {
        let opacityValue = 1;

        const fadeOutInterval = setInterval(() => {
            opacityValue -= 0.1;

            if (opacityValue >= 0) {
                toasterContainer.style.opacity = opacityValue.toString();
            } else {
                toasterContainer.remove();
                clearInterval(fadeOutInterval);
            }
        }, 450);
    }, 1000);
};