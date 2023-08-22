/*******************************************************************************
 *
 * Initialisation des paramètres de jeu
 *
*******************************************************************************/

let paintedPixels = 0;
let round = 0;
const grid = document.getElementById('grille');
const gridSize = grid.clientWidth;
const pixelElts = document.getElementsByClassName('pixel');
const scores = document.getElementById('scores');
const difficultySlider = document.getElementById('setDifficulty')
const displaySize = document.getElementById('size');
let startTime;
let endTime;
let matrixSize = 5;
let scoreList = [];
let leftClickEnabled = true;
let palette;




/*******************************************************************************
 *
 * Initialisation des écouteurs
 *
*******************************************************************************/

grid.addEventListener('click', function (event) {
    if (leftClickEnabled) {
        startGame(event);
        leftClickEnabled = false; // Désactiver le clic gauche
    }
});

grid.addEventListener('auxclick', (e) => {
    e.preventDefault();
    resetGame()
    leftClickEnabled = true; // Réactiver le clic gauche
});

difficultySlider.addEventListener('change', (e) => {
    matrixSize = difficultySlider.value;
    displaySize.textContent = matrixSize + 'x' + matrixSize + ' pixels';
    createMatrix(matrixSize);
});




/*******************************************************************************
 *
 * Gestion de la partie
 *
*******************************************************************************/

/**
 * Lance une partie
 * @param {*} event 
 */
function startGame(event) {
    showPixel();
    paintPixel();
    setPainted(event);
    randPalette();
    // displayColor();
    console.time('Temps de jeu');
    startTime = Date.now();
    console.log(`Partie lancée avec la palette ${palette} !`);
}

/**
 * Réinitialise la partie
 */
function resetGame() {
    console.timeEnd('Temps de jeu');
    endTime = Date.now();
    console.clear();
    createMatrix(matrixSize);
    paintedPixels = 0;
    leftClickEnabled = true; // Réactiver le clic gauche
}

/**
 * Surveille l'état de la grille :
 * Arrête la partie en cas de victoire et lance l'affichage des scores
 * @param {*} event 
 */
function winGame(event) {
    if (paintedPixels == pixelElts.length) {
        rainbowPixel(event);
        console.timeEnd('Temps de jeu');
        endTime = Date.now();
        let time = endTime - startTime;
        storeScores(time);
        displayScores(storeScores);
        setTimeout(() => alert('Gagné ! Vous avez mis ' + (time / 1000) + ' s.'), 150);
    }
}

/**
 * Enregistre les scores sous forme d'ojbet { score: round },
 * tri les scores de manière creoissante et conserve 13 meilleurs
 * @param int value 
 */
function storeScores(value) {
    scoreList.push({ 'score': value / 1, 'round': ++round });
    scoreList.sort((a, b) => a.score - b.score);
    const newScorList = scoreList.slice(0, 13);
    scoreList = newScorList;
}

/**
 * Affiche la liste des scores
 */
function displayScores(array) {
    scores.replaceChildren();
    let title = document.createElement('h2');
    title.textContent = 'Scores';
    scores.appendChild(title);
    scoreList.forEach((scoreValue) => {
        let score = document.createElement('p');
        score.textContent = scoreValue.score + ' ms';
        if (scoreValue.round == scoreList.length) {
            score.setAttribute('class', 'last_round');
        }
        scores.appendChild(score);
    });
}




/*******************************************************************************
 *
 * Gestion de la grille
 *
*******************************************************************************/

grid.oncontextmenu = (e) => {
    e.preventDefault();
}

/**
 * Construit une grille carré de n pixels de côté
 * @param int size 
 */
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

function randPalette() {
    palette = Math.ceil(Math.random() * 3);
}

createMatrix(matrixSize); // Création automatique d'une première grille avec les paramètres standards




/*******************************************************************************
 *
 * Gestion des pixels
 *
*******************************************************************************/

/**
 * Affiche en blanc le pixel ciblé
 */
function showPixel() {
    Array.from(pixelElts).forEach((pixel) => {
        // On passe en blanc à l'entrée
        pixel.addEventListener('mouseover', function (event) {
            event.target.style.backgroundColor = "#fff";
            setPainted(event);
        });
    });
}

/**
 * Colore le pixel ciblé à la sortie
 */
function paintPixel() {
    Array.from(pixelElts).forEach((pixel) => {
        // On passe en rouge à la sortie
        pixel.addEventListener('mouseleave', function (event) {
            rainbowPixel(event);
        });
    });
}

/**
 * Ajoute un attribut 'painted' au pixel ciblé
 * @param {*} event
 */
function setPainted(event) {
    if (event.target.getAttribute('painted') != 'yes') {
        paintedPixels++;
        console.log(paintedPixels);
        event.target.setAttribute('painted', 'yes');
        winGame(event);
    }
}

/**
 * Attribue au pixel ciblé une couleur RGB en fonction de sa position dans la grille
 * @param {*} event 
 */
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




/*******************************************************************************
 *
 * Functions de débogage
 *
*******************************************************************************/

// On affiche les coordonnées du pointer durant le survol à l'intérieur de l'élement survolé
function displayLocation() {
    Array.from(pixelElts).forEach((pixel) => {
        pixel.addEventListener('mousemove', function (event) {
            this.textContent = event.clientX + " " + event.clientY;
        });
    });
}

function displayColor() {
    Array.from(pixelElts).forEach((pixel) => {
        pixel.addEventListener('mouseleave', function (event) {
            this.textContent = event.target.style.backgroundColor;
        });
    });
}