const contagiri = document.querySelector('.contagiri');
const scocca = document.querySelector('.bar');
const interno = document.querySelector('.contagiri-interno');


const numbers = [];
const bar =[];
const line = [];

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
    line.push(`<div class="line" style="--index:${i};"></div>`);
}
console.log(line);
interno.insertAdjacentHTML('afterbegin', line.join(''));




