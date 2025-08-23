const contagiri = document.querySelector('.contagiri');

const numbers = [];

for (let i = 0; i <= 12; i++) {
    numbers.push(`<span style="--index:${i};"><p>${i}</p></span>`);
}
console.log(numbers);

contagiri.insertAdjacentHTML('afterbegin', numbers.join(''));
