const contagiri = document.querySelector('.contagiri');
const scocca = document.querySelector('.bar');
const interno = document.querySelector('.contagiri-interno');
const shift = document.getElementById('gear');
const textKmh = document.getElementById('speed');
const kmH = document.querySelector('.display-1 h2');
const D1 = document.querySelector('.onOffDisplay1');
const D2 = document.querySelector('.onOffDisplay2');
const displayTop = document.querySelector('.top')
const simbolShift = document.getElementById('imgShift')
const benzina = document.querySelector('.tacche')




// CREAZIONE NUMERI E BARRA CONTAGIRI

const numbers = [];
const bar =[];
const line = [];
const lineSpace = [];
const tacchaBenzina = [];

//CREAZIONE CONTAMARCE
const changeShift = ['R','N','1','2','3','4','5','6','7'];
const velocitaPerRapporto = [0, 0, 90, 145, 205, 260, 310, 335, 340];
let currentShiftIndex = 1;

shift.insertAdjacentHTML('beforeend', `${changeShift[currentShiftIndex]}`);


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
    line.push(`<div class="line${i} lineAll" style="--index:${i};"></div>`);
}
console.log(line);
interno.insertAdjacentHTML('afterbegin', line.join(''));

for (let i = 1; i <= 13; i++) {
    lineSpace.push(`<div class="line-space" style="--index:${i};"><p></p></div>`);
}
interno.insertAdjacentHTML('afterbegin', lineSpace.join(''));

for (let i = 1; i < 10 ; i++) {
    tacchaBenzina.push(`<div class="taccha-benzina" style="--index:${i};"></div>`);  
}
benzina.insertAdjacentHTML('afterbegin', tacchaBenzina.join(''));



//LOGICA LANCETTA

// const velocitaAvanti = [0, 250, 2.8, 10, 15, 23, 47, 95, 60];   // gradi/sec

const freccia = document.querySelector('.container-freccia');
let rotazione = 0;
const velocitaAvanti = [3, 0.6, 2.8, 4, 15, 23, 40, 75, 90];   // gradi/sec
const velocitaIndietro = [20, 1.8, 20, 20, 20, 20, 37, 55, 70] // gradi/sec
const rotazioneMassima = 232.5;
let rotazioneMinima = 0;
let speed = 0;
let motoreAcceso = false;
let premutoW = false;
let premutoS = false;
let premutoArrowUp = false
let premutoArrowDoun = false
let ultimaChiamata = null;
let animationFrameId = null;
const inizioAudio = new Audio("audio/ferrariStart.m4a");
const fineAudio = new Audio("audio/ferrariIdle.wav");
const ferrariOffAudio = new Audio("audio/ferrariEngineOff.m4a");
const sound = new Audio("audio/2000rpm-9000rpm.wav");
// const sound = new Audio("audio/ferrariSound.m4a");
const scoppiettioAudio = new Audio("audio/scoppiettio-relase.wav");
let audioInterval;




// ACCENSIONE/SPEGNIMENTO MOTORE
document.addEventListener('keyup', (e) => {
  if (e.key.toLowerCase() === 'p' && !motoreAcceso) {
    // ACCENSIONE
    D1.classList.add("accendi")
    D2.classList.add("accendi")
    shift.classList.add("visibile-shift")
    kmH.classList.add("visibile-kmH")
    textKmh.classList.add("visibile-kmH")
    kmH.innerText = speed;
    motoreAcceso = true;
    rotazioneMinima = 25;
    inizioAudio.play()
    audioInterval = setInterval(() => {
      fineAudio.play();
    }, 500);

    if (rotazione < rotazioneMinima) {
      rotazione = rotazioneMinima;
      freccia.style.transition = 'transform 0.2s ease-in';
      freccia.style.transform = `rotate(${rotazione + 25}deg)`;

      setTimeout(() => {
        rotazione = rotazioneMinima;
        freccia.style.transition = 'transform 0.5s ease-in';
        freccia.style.transform = `rotate(${rotazione}deg)`;
      }, 2500);
    }

    startAnimazione(); // Avvia loop dinamico

  } else if (motoreAcceso && e.key.toLowerCase() === 'p') {
    // SPEGNIMENTO
    D1.classList.remove("accendi")
    D2.classList.remove("accendi")
    shift.classList.remove("visibile-shift") 
    kmH.classList.remove("visibile-kmH")
    textKmh.classList.remove("visibile-kmH")
    kmH.style.visibility = 'hidden';
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
    if (rotazione > 180) {
      scoppiettioAudio.play()
      scoppiettioAudio.volume = 0.125;
    }
  }
});

// PRESSIONE S
document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 's') {
    premutoS = true; 
  }
});

document.addEventListener('keyup', (e) => {
  if (e.key.toLowerCase() === 's') {
    premutoS = false;
    if (rotazione > 180) {
      scoppiettioAudio.play()
      scoppiettioAudio.volume = 0.125;
    }
  }
});

// CAMBIO MARCIA (ArrowUp / ArrowDown)
let attesa = false

document.addEventListener('keydown', (e) => {
  if (!motoreAcceso) return; // funziona solo a motore acceso

  if (e.key.toLowerCase() === 'arrowup') {
    if (currentShiftIndex < changeShift.length - 1) {
      currentShiftIndex++;
      // setInterval(() => {
      attesa = true;
    // }, 500);
      freccia.style.transition = 'transform 0.30s';
      rotazione = 25 + (speed / velocitaPerRapporto[currentShiftIndex]) * (rotazioneMassima - 25);
      // rotazione = (speed / velocitaPerRapporto[currentShiftIndex]) * (rotazioneMassima); // piccolo calo di giri
    


      freccia.style.transform = `rotate(${rotazione}deg)`;
      shift.textContent = changeShift[currentShiftIndex];
      console.log('Marcia:', changeShift[currentShiftIndex]);
    } else {
      console.log('Sei già alla marcia massima!');
    }
  }

  if (e.key.toLowerCase() === 'arrowdown') {
    if (currentShiftIndex > 0) {
      currentShiftIndex--;
      // setInterval(() => {
      attesa = true;
    // }, 500);
      rotazione = 25 + (speed / velocitaPerRapporto[currentShiftIndex]) * (rotazioneMassima - 25); // piccolo aumento di giri
      
      
      if ([0, 1].includes(currentShiftIndex)) {
        rotazione = rotazioneMinima;
      };
      freccia.style.transition = 'transform 0.30s';
      freccia.style.transform = `rotate(${rotazione}deg)`;
      shift.textContent = changeShift[currentShiftIndex];
      console.log('Marcia:', changeShift[currentShiftIndex]);
    } else {
      console.log('Sei già alla marcia minima (R)!');
    }
  }
});
// Definiamo la funzione che gestisce l'evento per 'Arrow Up'
function gestisciArrowUp(e) {
  if (e.key.toLowerCase() === 'arrowup') {
    setTimeout(() => {
      attesa = false;
    }, 300);
  }
}

// Aggiungiamo l'event listener per il tasto 'Arrow Up'
document.addEventListener('keyup', gestisciArrowUp);

// Definiamo la funzione che gestisce l'evento
function gestisciArrowDown(e) {
  if (e.key.toLowerCase() === 'arrowdown') {
      setTimeout(() => {
      attesa = false;
    }, 300);
  }
  }
// Aggiungiamo l'event listener, chiamando la funzione
document.addEventListener('keyup', gestisciArrowDown);




// LOOP DINAMICO
function aggiornaRotazione(timestamp) {
  if (!ultimaChiamata) ultimaChiamata = timestamp;
  const delta = (timestamp - ultimaChiamata) / 1000;  
  ultimaChiamata = timestamp;
  
  if (attesa) {
    animationFrameId = requestAnimationFrame(aggiornaRotazione);
    return; // salta l'aggiornamento della rotazione
  }

  let aggiorna = false;

  if (motoreAcceso) {
    if (premutoW && rotazione < rotazioneMassima) {
      rotazione += ((rotazioneMassima - 25) / velocitaAvanti[currentShiftIndex]) * delta;

      if (rotazione > rotazioneMassima) rotazione = rotazioneMassima;
      aggiorna = true;
    } else if (!premutoW && rotazione > rotazioneMinima) {
      rotazione -= ((rotazioneMassima - 25) / velocitaIndietro[currentShiftIndex]) * delta;

      if (rotazione < rotazioneMinima) rotazione = rotazioneMinima;
      aggiorna = true;
    }

// FRENO
if (premutoS && currentShiftIndex >= 2) {
    const indiceFrenata = 5;
    rotazione -= ((rotazioneMassima - 25) / (velocitaIndietro[currentShiftIndex] / indiceFrenata)) * delta;
    if (rotazione < rotazioneMinima) rotazione = rotazioneMinima;
    aggiorna = true;
}

if (currentShiftIndex === 1 && !premutoW) {  // Se siamo in folle (marcia 'N')
      if (speed > 0) {
        speed -= 0.02; // Decelerazione graduale
      kmH.textContent = Math.floor(speed);
        if (speed <= 1) speed = 0; // Limita la velocità minima a 0
      }
    }


    
    if (aggiorna) {
   
      freccia.style.transition = 'none';
      freccia.style.transform = `rotate(${rotazione}deg)`;
      // sound.loop = true;
// sound.pause(); // avvia subito ma metti in pausa

    simbolShift.classList.remove("visible-simbol-down")
    simbolShift.classList.remove("visible-simbol-up")
    if (currentShiftIndex === 2) {
      if (rotazione > 190) {
        simbolShift.classList.add("visible-simbol-up")
      } else if (rotazione < 190) {
        simbolShift.classList.remove("visible-simbol-up")
      }
      speed = ((rotazione - 25) / (rotazioneMassima - 25)) * velocitaPerRapporto[2]; // 0-30 km/h
   } else if (currentShiftIndex === 3) {
      if (rotazione < 130) {
      simbolShift.classList.add("visible-simbol-down")
    } else {
      simbolShift.classList.remove("visible-simbol-down")
    }
    if (rotazione > 190) {
      simbolShift.classList.add("visible-simbol-up")
    } else {
      simbolShift.classList.remove("visible-simbol-up")
    }
    speed = ((rotazione - 25) / (rotazioneMassima - 25)) * velocitaPerRapporto[3]; // 30-60 km/h
   } else if (currentShiftIndex === 4) {
      if (rotazione < 140) {
      simbolShift.classList.add("visible-simbol-down")
    } else {
      simbolShift.classList.remove("visible-simbol-down")
    }
    if (rotazione > 190) {
      simbolShift.classList.add("visible-simbol-up")
    } else {
      simbolShift.classList.remove("visible-simbol-up")
    }
    speed = ((rotazione - 25) / (rotazioneMassima - 25)) * velocitaPerRapporto[4]; // 60-90 km/h
   } else if (currentShiftIndex === 5) {
    if (rotazione < 150) {
      simbolShift.classList.add("visible-simbol-down")
    } else {
      simbolShift.classList.remove("visible-simbol-down")
    }
    if (rotazione > 210) {
      simbolShift.classList.add("visible-simbol-up")
    } else {
      simbolShift.classList.remove("visible-simbol-up")
    }
    speed = ((rotazione - 25) / (rotazioneMassima - 25)) * velocitaPerRapporto[5]; // 90-120 km/h
   } else if (currentShiftIndex === 6) {
    if (rotazione < 180) {
      simbolShift.classList.add("visible-simbol-down")
    } else {
      simbolShift.classList.remove("visible-simbol-down")
    }
    if (rotazione > 210) {
      simbolShift.classList.add("visible-simbol-up")
    } else {
      simbolShift.classList.remove("visible-simbol-up")
    }
    speed = ((rotazione - 25) / (rotazioneMassima - 25)) * velocitaPerRapporto[6]; // 120-150 km/h
   } else if (currentShiftIndex === 7) {
    if (rotazione < 190) {
      simbolShift.classList.add("visible-simbol-down")
    } else {
      simbolShift.classList.remove("visible-simbol-down")
    }
    if (rotazione > 215) {
      simbolShift.classList.add("visible-simbol-up")
    } else {
      simbolShift.classList.remove("visible-simbol-up")
    }
    speed = ((rotazione - 25) / (rotazioneMassima - 25)) * velocitaPerRapporto[7]; // 150-200 km/h
   } else if (currentShiftIndex === 8)  {
    if (rotazione < 210) {
      simbolShift.classList.add("visible-simbol-down")
    } else {
      simbolShift.classList.remove("visible-simbol-down")
    }
    speed = ((rotazione - 25) / (rotazioneMassima - 25)) * velocitaPerRapporto[8]; // 200-220 km/h
    }

      kmH.textContent = Math.floor(speed);
      

      let rate = 12 * (rotazione / rotazioneMassima); // da 0.5 a 1.5 (o come preferisci)

  sound.currentTime = rate;
  if (rotazione > rotazioneMinima) {
      sound.play()
      sound.volume = 0.06;
      fineAudio.pause()  

    }else{
      sound.pause()
    }
  
    if (rotazione >= rotazioneMassima) {
      scoppiettioAudio.play();
      scoppiettioAudio.volume = 0.07;
      sound.pause()

    }

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

displayTop.insertAdjacentHTML('afterbegin', `<p>${new Date().getHours() + ":" + new Date().getMinutes()}</p>`)



//LOGICA ACCDNSIONE DEL QUADRO

const lineeLuci = document.querySelectorAll(".lineAll")
const lineeLuciS = document.querySelectorAll(".line-space p")
const numberlight = document.querySelectorAll(".container .scocca-contagiri .contagiri span p")
const textlight = document.getElementById("text-giri")
const textlight1 = document.querySelector("#text-giri span")
const frecciaLed = document.querySelector(".container-freccia")
const logoLed = document.querySelector(".container-interno-due img")
const miniled = document.querySelector(".container .scocca-contagiri .contagiri")
const miniled2 = document.querySelector(".container .scocca-contagiri")
const tacchette = document.querySelectorAll(".bar span p")



document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'l' && motoreAcceso) {

    textlight.classList.toggle("luminoso1")
    textlight1.classList.toggle("luminoso1")
    scocca.classList.toggle("barraRossaLed")
    frecciaLed.classList.toggle("frecciaLed")
    logoLed.classList.toggle("ledLogo")
    miniled.classList.toggle("miniLed")
    miniled2.classList.toggle("miniLed2")

    tacchette.forEach(luce => {
    luce.classList.toggle("tacchetteLuminose")
    });

      lineeLuci.forEach(luce => {
    luce.classList.toggle("luce-on")
    });

    lineeLuci.forEach(luce => {
    luce.classList.toggle("luminoso")
    });
    lineeLuciS.forEach(luce => {
      luce.classList.toggle("luminoso");
    });
     for (let i = 0; i < 9; i++) {
      numberlight[i].classList.toggle("luminoso1");
    };
     for (let i = 9; i < 11; i++) {
      numberlight[i].classList.toggle("luminoso2");
    };
  } else {
    return;  
  }
});

//LOGICA BENZINA
let fuel = 0;
const taccaPiena = document.querySelectorAll(".taccha-benzina")

setInterval(() => {
if (fuel < taccaPiena.length) {

  taccaPiena[fuel].classList.add("fuelGas");

//   taccaPiena.forEach((benzina, index) => {
//     if (index < taccaPiena.length - fuel) {
//         benzina.classList.add("fuelGas");        
//     }
// });
  fuel += 1;
}
    }, 1000);















  









