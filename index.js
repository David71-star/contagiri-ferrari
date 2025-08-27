const contagiri = document.querySelector('.contagiri');
const scocca = document.querySelector('.bar');
const interno = document.querySelector('.contagiri-interno');


const numbers = [];
const bar =[];
const line = [];
const lineSpace = [];

for (let i = 0; i <= 12; i++) {
    numbers.push(`<span style="--index:${i};"><p>${i}</p></span>`);
}
console.log(numbers);

contagiri.insertAdjacentHTML('afterbegin', numbers.join(''));

for (let i = 1; i <= 72; i++) {
    bar.push(`<span style="--index:${i};"><p></p></span>`);
}
console.log(bar);
scocca.insertAdjacentHTML('afterbegin', bar.join(''));

for (let i = 1; i <= 4; i++) {
    line.push(`<div class="line${i}" style="--index:${i};"></div>`);
}
console.log(line);
interno.insertAdjacentHTML('afterbegin', line.join(''));

for (let i = 1; i <= 13; i++) {
    lineSpace.push(`<div class="line-space" style="--index:${i};"><p></p></div>`);
}
interno.insertAdjacentHTML('afterbegin', lineSpace.join(''));

//LOGICA LANCETTA


const freccia = document.querySelector('.container-freccia');
let rotazione = 0;
const velocitaAvanti = 360;   // gradi/sec
const velocitaIndietro = 100; // gradi/sec
const rotazioneMassima = 250;
let rotazioneMinima = 0;

let motoreAcceso = false;
let premutoW = false;
let ultimaChiamata = null;
let animationFrameId = null;
const startEngine = new Audio('./audio/')

// ACCENSIONE/SPEGNIMENTO MOTORE
document.addEventListener('keyup', (e) => {
  if (e.key.toLowerCase() === 'p' && !motoreAcceso) {
    // ACCENSIONE
    motoreAcceso = true;
    rotazioneMinima = 30;

    if (rotazione < rotazioneMinima) {
      rotazione = rotazioneMinima;
      freccia.style.transition = 'transform 0.3s ease-in 0.5s';
      freccia.style.transform = `rotate(${rotazione + 30}deg)`;

      setTimeout(() => {
        rotazione = rotazioneMinima;
        freccia.style.transition = 'transform 0.5s ease-in';
        freccia.style.transform = `rotate(${rotazione}deg)`;
      }, 1800);
    }

    startAnimazione(); // Avvia loop dinamico

  } else if (motoreAcceso && e.key.toLowerCase() === 'p') {
    // SPEGNIMENTO
    motoreAcceso = false;
    premutoW = false;
    stopAnimazione(); // Ferma loop dinamico

    rotazione = 0;
    freccia.style.transition = 'transform 0.5s ease-out';
    freccia.style.transform = `rotate(${rotazione}deg)`;
  }
});

// PRESSIONE W
document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'w') {
    premutoW = true;
  }
});

document.addEventListener('keyup', (e) => {
  if (e.key.toLowerCase() === 'w') {
    premutoW = false;
  }
});

// LOOP DINAMICO
function aggiornaRotazione(timestamp) {
  if (!ultimaChiamata) ultimaChiamata = timestamp;
  const delta = (timestamp - ultimaChiamata) / 1000;
  ultimaChiamata = timestamp;

  let aggiorna = false;

  if (motoreAcceso) {
    if (premutoW && rotazione < rotazioneMassima) {
      rotazione += velocitaAvanti * delta;
      if (rotazione > rotazioneMassima) rotazione = rotazioneMassima;
      aggiorna = true;
    } else if (!premutoW && rotazione > rotazioneMinima) {
      rotazione -= velocitaIndietro * delta;
      if (rotazione < rotazioneMinima) rotazione = rotazioneMinima;
      aggiorna = true;
    }

    if (aggiorna) {
      freccia.style.transition = 'none';
      freccia.style.transform = `rotate(${rotazione}deg)`;
    }
  }

  animationFrameId = requestAnimationFrame(aggiornaRotazione);
}

function startAnimazione() {
  ultimaChiamata = null;
  animationFrameId = requestAnimationFrame(aggiornaRotazione);
}

function stopAnimazione() {
  cancelAnimationFrame(animationFrameId);
  animationFrameId = null;
}


