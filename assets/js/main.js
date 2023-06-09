//VARIABILI
const loader = document.querySelector(".loading");
const modal = document.querySelector(".modal");
const modalContent = document.querySelector(".modal-content");
const modalClose = document.querySelector(".modal-close");
const API_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-3.5-turbo";
const API_KEY = "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";
// FUNZIONI
async function playCharacter(nameCharacter) {
  //mostrare il loader
  loader.classList.remove("loading-hidden");
  //richiamare le API di OpenAI
  // const action = "Saluta in modo iconico";
  const action = getRandomAction();
  const temperature = 0.7;
  //recuperare la risposta
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: "user",
          content: `Sei ${nameCharacter} e ${action} con un massimo di 100 caratteri senza mai uscire dal personaggio`,
        },
      ],
      temperature: temperature,
    }),
  });
  //interpretare la risposta in JSON
  const data = await response.json();
  //compilare la modale con i dati ricevuti
  const message = data.choices[0].message.content;
  modalContent.innerHTML = `
  <h2>${nameCharacter}</h2>
  <p>${message}</p>
  <code>Character: ${nameCharacter}, action: ${action}, temperature: ${temperature}</code>
  `;
  //nascondere il loader e mostrare la modale
  loader.classList.add("loading-hidden");
  modal.classList.remove("modal-hidden");
}

function getRandomAction() {
  const actions = [
    "saluta nel tuo modo iconico",
    "dammi un consiglio di stile in base ai tuoi gusti",
    "racconta la tua ultima avventura",
    "svelami i tuoi sogni",
    "dimmi chi è il tuo migliore amico",
    "scrivi la tua bio di linkedin",
  ];
  const indexRandom = Math.floor(Math.random() * (actions.length - 1));
  return actions[indexRandom];
}

// INIT
const characters = document.querySelectorAll(".character");

characters.forEach(function (element) {
  element.addEventListener("click", function () {
    playCharacter(element.dataset.character);
  });
});

modalClose.addEventListener("click", function () {
  modal.classList.add("modal-hidden");
});
