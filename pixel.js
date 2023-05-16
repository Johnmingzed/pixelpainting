let surveyMatrix = 0;
const grid = document.getElementById('grille');
const gridSize = grid.clientWidth;
const pixelElts = document.getElementsByClassName('pixel');
const scores = document.getElementById('scores');
let startTime;
let endTime;
let matrixSize = 10;
let scoreList = [];
let leftClickEnabled = true;
let palette;

grid.addEventListener('click', function (event) {
    if (leftClickEnabled) {
        showPixel();
        paintPixel();
        randPalette();
        console.time('Temps de jeu');
        startTime = Date.now();
        console.log(`Partie lancée avec la palette ${palette} !`);
        leftClickEnabled = false; // Désactiver le clic gauche
    }
});

grid.addEventListener('auxclick', (e) => {
    e.preventDefault();
    console.timeEnd('Temps de jeu');
    endTime = Date.now();
    console.clear();
    createMatrix(matrixSize);
    surveyMatrix = 0;
    leftClickEnabled = true; // Réactiver le clic gauche
});

grid.oncontextmenu = (e) => {
    e.preventDefault();
}

createMatrix(matrixSize);

function createMatrix(size) {
    console.log({ gridSize });
    console.time('Temps de rendu de la grille');
    grid.replaceChildren();
    for (i = 0; i < size * size; i++) {
        const div = document.createElement('div');
        div.setAttribute('class', 'pixel')
        grid.appendChild(div);
    }
    grid.style.gridTemplateColumns = `repeat(${size},1fr)`;
    console.timeEnd('Temps de rendu de la grille');
}


// Coloriage à l'aide d'une boucle for of
function showPixel() {
    Array.from(pixelElts).forEach((pixel) => {
        // On passe en vert à l'entrer
        pixel.addEventListener('mouseover', function (event) {
            event.target.style.backgroundColor = "#fff";
        });
    });
}

function paintPixel() {
    Array.from(pixelElts).forEach((pixel) => {
        // On passe en rouge à la sortie
        pixel.addEventListener('mouseleave', function (event) {
            rainbowPixel(event);
            //event.target.style.backgroundColor = "rgb(255,128,0)";
            if (event.target.getAttribute('painted') != 'yes') {
                surveyMatrix++;
                if (surveyMatrix == pixelElts.length) {
                    console.timeEnd('Temps de jeu');
                    endTime = Date.now();
                    let time = endTime - startTime;
                    storeScores(time);
                    displayScores(storeScores);
                    alert('Gagné ! Vous avez mis ' + (time / 1000) + ' s.');
                }
            }
            event.target.setAttribute('painted', 'yes');
        });
    });
}

// On affiche les coordonnées du pointer durant le survol à l'intérieur de l'élement survolé
function displayLocation() {
    Array.from(pixelElts).forEach((pixel) => {
        pixel.addEventListener('mousemove', function (event) {
            this.textContent = event.clientX + " " + event.clientY;
        });
    });
}

function storeScores(float) {
    scoreList.push(float / 1000);
    scoreList.sort();
    const newScorList = scoreList.slice(0, 13);
    scoreList = newScorList;
}

function displayScores(array) {
    scores.replaceChildren();
    let title = document.createElement('h2');
    title.textContent = 'Scores';
    scores.appendChild(title);
    scoreList.forEach((scoreValue) => {
        let score = document.createElement('p');
        score.textContent = scoreValue + 's';
        scores.appendChild(score);
    });
}

function rainbowPixel(event) {
    let color1 = Math.floor(event.target.offsetTop / gridSize * 255);
    let color2 = Math.floor(event.target.offsetLeft / gridSize * 255);
    let color3 = Math.floor(255 - color2);
    switch (palette) {
        case 1:
            event.target.style.backgroundColor = `rgb(${color3},${color1},${color2})`;
            break;
        case 2:
            event.target.style.backgroundColor = `rgb(${color1},${color2},${color3})`;
            break;
        case 3:
            event.target.style.backgroundColor = `rgb(${color2},${color3},${color1})`;
            break;
    }
}

function randPalette() {
    palette = Math.ceil(Math.random() * 3);
}