// games_manager.js
let currentGameIndex = 0;

const games = [
    {
        name: 'Flappy Bird',
        canvas: 'flappyCanvas',
        scoreDiv: 'flappyScoreDiv',
        controls: 'PRESS SPACE OR CLICK TO FLAP',
        start: window.flappy.start,
        stop: window.flappy.stop,
        reset: window.flappy.reset
    },
    {
        name: 'Tetris',
        canvas: 'tetrisCanvas',
        scoreDiv: 'tetrisScoreDiv',
        controls: 'ARROW KEYS: MOVE/ROTATE, DOWN: DROP',
        start: window.tetris.start,
        stop: window.tetris.stop,
        reset: window.tetris.reset
    },
    {
        name: 'Snake',
        canvas: 'snakeCanvas',
        scoreDiv: 'snakeScoreDiv',
        controls: 'ARROW KEYS: MOVE',
        start: window.snake.start,
        stop: window.snake.stop,
        reset: window.snake.reset
    }
];

function switchGame(index) {
    games[currentGameIndex].stop();
    document.getElementById(games[currentGameIndex].canvas).style.display = 'none';
    document.getElementById(games[currentGameIndex].scoreDiv).style.display = 'none';

    currentGameIndex = index;

    document.getElementById(games[currentGameIndex].canvas).style.display = 'block';
    document.getElementById(games[currentGameIndex].scoreDiv).style.display = 'block';
    document.getElementById('gameTitle').textContent = games[currentGameIndex].name;
    document.getElementById('controlsText').textContent = games[currentGameIndex].controls;
    document.getElementById('resetBtn').onclick = games[currentGameIndex].reset;

    games[currentGameIndex].reset();  // Reset and start the new game
}

document.getElementById('leftArrow').onclick = () => {
    let newIndex = (currentGameIndex - 1 + games.length) % games.length;
    switchGame(newIndex);
};

document.getElementById('rightArrow').onclick = () => {
    let newIndex = (currentGameIndex + 1) % games.length;
    switchGame(newIndex);
};

// Initial setup
switchGame(0);
