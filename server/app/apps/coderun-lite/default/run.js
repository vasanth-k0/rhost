const test = 'Test';
console.log( `Viyath's ${test} js script running on Coderun-Lite\n<br>\n`);
let i = 1;
const MAX_COUNT =  3;

const id = setInterval(() => {
    if (i <= MAX_COUNT) {
        console.log( i );
        i++;
    } else {
        clearInterval(id)
    }
}, 1000);