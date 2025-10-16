// flappy.js (renamed and implemented basic Flappy Bird to match the original setup)
const canvas = document.getElementById('flappyCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('flappyScore');
const highScoreDisplay = document.getElementById('flappyHigh');

let bird = { x: 50, y: 300, velocity: 0, gravity: 1.5, lift: -25, size: 20 };
let pipes = [];
let frame = 0;
let gameRunning = false;
let score = 0;
let highScore = 0;

function drawBird() {
    ctx.fillStyle = '#ffff00';
    ctx.fillRect(bird.x, bird.y, bird.size, bird.size);
}

function drawPipes() {
    ctx.fillStyle = '#0f0';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);
    });
}

function update() {
    if (!gameRunning) return;

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.size > canvas.height || bird.y < 0) gameOver();

    if (frame % 90 === 0) {
        pipes.push({
            x: canvas.width,
            width: 50,
            top: Math.floor(Math.random() * (canvas.height / 3) + canvas.height / 6),
            bottom: Math.floor(Math.random() * (canvas.height / 3) + canvas.height / 6)
        });
    }

    pipes.forEach((pipe, index) => {
        pipe.x -= 2;
        if (pipe.x + pipe.width < 0) pipes.splice(index, 1);

        if (bird.x + bird.size > pipe.x && bird.x < pipe.x + pipe.width &&
            (bird.y < pipe.top || bird.y + bird.size > canvas.height - pipe.bottom)) {
            gameOver();
        }

        if (pipe.x === bird.x) score++;
    });

    frame++;

    ctx.fillStyle = '#87ceeb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawBird();
    drawPipes();

    scoreDisplay.textContent = score;
    highScoreDisplay.textContent = highScore;

    requestAnimationFrame(update);
}

function gameOver() {
    gameRunning = false;
    if (score > highScore) highScore = score;
    alert('Game Over! Score: ' + score);
    resetGame();
}

function resetGame() {
    bird.y = 300;
    bird.velocity = 0;
    pipes = [];
    frame = 0;
    score = 0;
    gameRunning = true;
    update();
}

document.addEventListener('keydown', e => {
    if (e.key === ' ') {
        bird.velocity = bird.lift;
        e.preventDefault(); // Prevent default scrolling behavior
    }
});

canvas.addEventListener('click', () => {
    bird.velocity = bird.lift;
});

// Expose functions for manager
window.flappy = {
    start: function() {
        gameRunning = true;
        update();
    },
    stop: function() {
        gameRunning = false;
    },
    reset: resetGame
};
