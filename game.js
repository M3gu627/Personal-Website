// Flappy Bird Game
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let bird = {
    x: 50,
    y: 300,
    velocity: 0,
    gravity: 0.5,
    jump: -10,
    size: 20
};

let pipes = [];
let score = 0;
let highScore = 0;
let gameOver = false;
let gameStarted = false;
let frameCount = 0;

function drawBird() {
    ctx.fillStyle = '#ffff00';
    ctx.fillRect(bird.x, bird.y, bird.size, bird.size);
    ctx.fillStyle = '#000';
    ctx.fillRect(bird.x + 15, bird.y + 5, 3, 3);
    ctx.fillStyle = '#ff6600';
    ctx.fillRect(bird.x + 20, bird.y + 10, 5, 3);
}

function drawPipes() {
    ctx.fillStyle = '#0f0';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
        ctx.fillRect(pipe.x, pipe.top + pipe.gap, pipe.width, canvas.height);
        
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(pipe.x, 0, pipe.width, pipe.top);
        ctx.strokeRect(pipe.x, pipe.top + pipe.gap, pipe.width, canvas.height);
    });
}

function drawGround() {
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
    
    for (let i = 0; i < canvas.width; i += 20) {
        ctx.fillStyle = '#654321';
        ctx.fillRect(i, canvas.height - 50, 10, 50);
    }
}

function updateBird() {
    if (!gameStarted) return;
    
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;
    
    if (bird.y + bird.size > canvas.height - 50) {
        bird.y = canvas.height - 50 - bird.size;
        endGame();
    }
    
    if (bird.y < 0) {
        bird.y = 0;
        bird.velocity = 0;
    }
}

function updatePipes() {
    if (!gameStarted) return;
    
    frameCount++;
    
    if (frameCount % 90 === 0) {
        let gap = 150;
        let top = Math.random() * (canvas.height - gap - 100) + 50;
        pipes.push({
            x: canvas.width,
            top: top,
            gap: gap,
            width: 50,
            scored: false
        });
    }
    
    pipes.forEach((pipe, index) => {
        pipe.x -= 3;
        
        if (pipe.x + pipe.width < 0) {
            pipes.splice(index, 1);
        }
        
        if (!pipe.scored && pipe.x + pipe.width < bird.x) {
            score++;
            pipe.scored = true;
            document.getElementById('scoreDisplay').textContent = score;
            
            if (score > highScore) {
                highScore = score;
                document.getElementById('highScore').textContent = highScore;
            }
        }
        
        if (
            bird.x + bird.size > pipe.x &&
            bird.x < pipe.x + pipe.width &&
            (bird.y < pipe.top || bird.y + bird.size > pipe.top + pipe.gap)
        ) {
            endGame();
        }
    });
}

function endGame() {
    gameOver = true;
    gameStarted = false;
}

function resetGame() {
    bird.y = 300;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    gameOver = false;
    gameStarted = true;
    frameCount = 0;
    document.getElementById('scoreDisplay').textContent = score;
}

function gameLoop() {
    ctx.fillStyle = '#87ceeb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawGround();
    drawPipes();
    drawBird();
    
    updateBird();
    updatePipes();
    
    if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ff00ff';
        ctx.font = '30px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
        ctx.font = '15px "Press Start 2P"';
        ctx.fillText('Score: ' + score, canvas.width / 2, canvas.height / 2 + 40);
    }
    
    if (!gameStarted && !gameOver) {
        ctx.fillStyle = '#ffff00';
        ctx.font = '20px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('CLICK TO START', canvas.width / 2, canvas.height / 2);
    }
    
    requestAnimationFrame(gameLoop);
}

function jump() {
    if (gameOver) {
        return;
    }
    
    if (!gameStarted) {
        gameStarted = true;
    }
    
    bird.velocity = bird.jump;
}

canvas.addEventListener('click', jump);

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        jump();
    }
});

// Start the game loop
gameLoop();
