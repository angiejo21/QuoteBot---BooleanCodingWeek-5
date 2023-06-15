/*---------------
VARIABILI
----------------*/
const loader = document.querySelector(".loading");
const modal = document.querySelector(".modal");
const modalContent = document.querySelector(".modal-content");
const modalClose = document.querySelector(".modal-close");
const characters = document.querySelectorAll(".character");
const API_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-3.5-turbo";
const API_KEY = "";
const saveBtn = document.querySelector("#save");
const shareBtn = document.querySelector("#share");

/*---------------
 FUNZIONI
----------------*/
function getImgPath(nameCharacter) {
  if (nameCharacter.includes(" ")) {
    const spaceIndex = nameCharacter.indexOf(" ");
    const path = `${nameCharacter.slice(0, spaceIndex)}-${nameCharacter.slice(
      spaceIndex + 1
    )}`;
    return path.toLowerCase();
  } else {
    return nameCharacter.toLowerCase();
  }
}

async function playCharacter(nameCharacter) {
  //1.mostrare il loader
  //2.richiamare le API di OpenAI
  loader.classList.remove("loading-hidden");
  const action = getRandomAction();
  const temperature = 0.7;
  //3.recuperare la risposta
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

  //4.interpretare la risposta in JSON
  const data = await response.json();

  //5.compilare la modale con i dati ricevuti
  const message = data.choices[0].message.content;
  modalContent.innerHTML = `
  <div class="character">
  <img src="/assets/img/${getImgPath(
    nameCharacter
  )}.png" alt="${nameCharacter}" />
  </div>
  <h2>${nameCharacter}</h2>
  <p>${message}</p>
  <code>Character: ${nameCharacter}, action: ${action}, temperature: ${temperature}</code>
  `;

  //nascondere il loader e mostrare la modale
  loader.classList.add("loading-hidden");
  modal.classList.remove("modal-hidden");
}
//Scegliere una azione random
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

function saveQuote() {
  html2canvas(modalContent).then(function (canvas) {
    const dataURI = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURI;
    link.download = `quoteBOT-${getImgPath(
      modal.querySelector("h2").innerText
    )}.png`;
    link.click();
  });
}

async function shareQuote() {
  //1.assemblare il messaggio da condividere
  const character = modal.querySelector("h2").innerText;
  const quote = modal.querySelector("p").innerText;

  const text = `Senti cosa ha da dire ${character}: "${quote}" #QuoteBOT #BooleanCoodingWeek`;
  //2. condividerlo con shareAPI
  if (navigator.canShare) {
    await navigator.share({ text: text });
  } else {
    console.log("Share API not supported");
    fallbackShare();
  }
}

function fallbackShare() {
  //https://wa.me/?text=urlencodedtext
  const href = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.location.href = href;
}

/*---------------
 INIZIALIZZAZIONE ED EVENTI
----------------*/

characters.forEach(function (element) {
  element.addEventListener("click", function () {
    playCharacter(element.dataset.character);
  });
});

modalClose.addEventListener("click", function () {
  modal.classList.add("modal-hidden");
});

saveBtn.addEventListener("click", saveQuote);
shareBtn.addEventListener("click", shareQuote);
