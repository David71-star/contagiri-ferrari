const contagiri = document.querySelector('.contagiri');
const scocca = document.querySelector('.bar');
const interno = document.querySelector('.contagiri-interno');
const shift = document.getElementById('gear');
const infoShift = document.querySelector('.shift-detail')


const numbers = [];
const bar =[];
const line = [];
const lineSpace = [];

for (let i = 0; i <= 12; i++) {
  let display;
  
  if (i === 1) {
    display = 'I';
  } else if (i === 10) {
    display = 'I0';
  } else {
    display = i;
  }

  numbers.push(`<span style="--index:${i};"><p>${display}</p></span>`);
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
const velocitaAvanti = 300;   // gradi/sec
const velocitaIndietro = 100; // gradi/sec
const rotazioneMassima = 247.5;
let rotazioneMinima = 0;

let motoreAcceso = false;
let premutoW = false;
let ultimaChiamata = null;
let animationFrameId = null;
const inizioAudio = new Audio("audio/ferrariStart.m4a");
const fineAudio = new Audio("audio/ferrariIdle.wav");
const ferrariOffAudio = new Audio("audio/ferrariEngineOff.m4a");
const sound = new Audio("audio/ferrariSound1.m4a")
let audioInterval;




// ACCENSIONE/SPEGNIMENTO MOTORE
document.addEventListener('keyup', (e) => {
  if (e.key.toLowerCase() === 'p' && !motoreAcceso) {
    // ACCENSIONE
    shift.classList.add("visibile") 
    motoreAcceso = true;
    rotazioneMinima = 25;
    inizioAudio.play()
    audioInterval = setInterval(() => {
      fineAudio.play();
    }, 500);

    if (rotazione < rotazioneMinima) {
      rotazione = rotazioneMinima;
      freccia.style.transition = 'transform 0.2s ease-in 0.7s';
      freccia.style.transform = `rotate(${rotazione + 50}deg)`;

      setTimeout(() => {
        rotazione = rotazioneMinima;
        freccia.style.transition = 'transform 0.5s ease-in';
        freccia.style.transform = `rotate(${rotazione}deg)`;
      }, 2500);
    }

    startAnimazione(); // Avvia loop dinamico

  } else if (motoreAcceso && e.key.toLowerCase() === 'p') {
    // SPEGNIMENTO
    shift.classList.remove("visibile") 
    fineAudio.pause();
    clearInterval(audioInterval)
    motoreAcceso = false;
    fineAudio.loop = false;
    ferrariOffAudio.play()
    inizioAudio.pause()
    inizioAudio.currentTime = 0
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
      // sound.loop = true;
// sound.pause(); // avvia subito ma metti in pausa

      let rate = 3.92 * (rotazione / rotazioneMassima); // da 0.5 a 1.5 (o come preferisci)
  // sound.currentTime = rate;
  sound.currentTime = rate;
  if (rotazione > 25) {
      sound.play()
      fineAudio.pause()

    }else{
      sound.pause()
      fineAudio.play()
      sound.currentTime = 0;
    }
// sound.play();
// sound.pause()
console.log(rate);



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


