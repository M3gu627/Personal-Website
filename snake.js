const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

// Game settings
const gridSize = 20;
const tileCount = canvas.width / gridSize;
let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let score = 0;
let gameSpeed = 100;
let gameLoop;

// Draw game
function drawGame() {
    // Clear canvas
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

    // Update score
    scoreDisplay.textContent = `Score: ${score}`;
}

// Move snake
function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Check for collisions with walls
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }

    // Check for collisions with self
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            gameOver();
            return;
        }
    }

    // Move snake
    snake.unshift(head);

    // Check for food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        generateFood();
    } else {
        snake.pop();
    }
}

// Generate new food position
function generateFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);

    // Ensure food doesn't spawn on snake
    for (let segment of snake) {
        if (food.x === segment.x && food.y === segment.y) {
            generateFood();
            return;
        }
    }
}

// Game over
function gameOver() {
    clearInterval(gameLoop);
    alert(`Game Over! Your score: ${score}`);
    resetGame();
}

// Reset game
function resetGame() {
    snake = [{ x: 10, y: 10 }];
    food = { x: 15, y: 15 };
    dx = 0;
    dy = 0;
    score = 0;
    gameSpeed = 100;
    gameLoop = setInterval(gameLoopFunc, gameSpeed);
}

// Main game loop
function gameLoopFunc() {
    moveSnake();
    drawGame();
}

// Handle keyboard input
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            if (dy !== 1) { dx = 0; dy = -1; }
            break;
        case 'ArrowDown':
            if (dy !== -1) { dx = 0; dy = 1; }
            break;
        case 'ArrowLeft':
            if (dx !== 1) { dx = -1; dy = 0; }
            break;
        case 'ArrowRight':
            if (dx !== -1) { dx = 1; dy = 0; }
            break;
    }
});

// Start game
gameLoop = setInterval(gameLoopFunc, gameSpeed);
