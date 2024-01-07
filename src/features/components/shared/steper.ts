const steps = document.querySelectorAll<HTMLElement>(".step");
const nextStep = document.getElementById("next__step__btn") as HTMLElement;
const previousStep = document.getElementById("previous__step__btn") as HTMLElement;

let currentStepIndex = 0;

previousStep.style.display = "none";
submitBtn.style.display = "none";

steps[currentStepIndex].classList.add("active");

nextStep.addEventListener("click", (event) => goToStep(event, 1));
previousStep.addEventListener("click", (event) => goToStep(event, -1));

const goToStep = (event: Event, direction: number): void => {
    event.preventDefault();

    const currentStep = steps[currentStepIndex];
    currentStep.classList.remove("active");

    currentStepIndex = (currentStepIndex + direction + steps.length) % steps.length;

    submitBtn.style.display = currentStepIndex === steps.length - 1 ? "block" : "none";
    previousStep.style.display = currentStepIndex !== 0 ? "flex" : "none";
    nextStep.style.display = currentStepIndex !== steps.length - 1 ? "flex" : "none";

    steps[currentStepIndex].classList.add("active");
}