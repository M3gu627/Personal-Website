const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

// Game settings
const gridSize = 20;
const cols = 10;
const rows = 20;
canvas.width = cols * gridSize;
canvas.height = rows * gridSize;
let board = Array(rows).fill().map(() => Array(cols).fill(0));
let score = 0;
let currentPiece = null;
let gameLoop;
let gameSpeed = 1000;

// Tetromino shapes
const shapes = [
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[1, 1, 1], [0, 1, 0]], // T
    [[1, 1, 1], [1, 0, 0]], // L
    [[1, 1, 1], [0, 0, 1]], // J
    [[1, 1, 0], [0, 1, 1]], // S
    [[0, 1, 1], [1, 1, 0]] // Z
];

// Colors for each shape
const colors = ['cyan', 'yellow', 'purple', 'orange', 'blue', 'green', 'red'];

// Create a new piece
function newPiece() {
    const id = Math.floor(Math.random() * shapes.length);
    return {
        shape: shapes[id],
        color: colors[id],
        x: Math.floor(cols / 2) - Math.floor(shapes[id][0].length / 2),
        y: 0
    };
}

// Draw the board
function drawBoard() {
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (board[y][x]) {
                ctx.fillStyle = colors[board[y][x] - 1];
                ctx.fillRect(x * gridSize, y * gridSize, gridSize - 1, gridSize - 1);
            }
        }
    }
}

// Draw the current piece
function drawPiece() {
    ctx.fillStyle = currentPiece.color;
    for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
            if (currentPiece.shape[y][x]) {
                ctx.fillRect((currentPiece.x + x) * gridSize, (currentPiece.y + y) * gridSize, gridSize - 1, gridSize - 1);
            }
        }
    }
}

// Check for collision
function collision(piece, dx = 0, dy = 0) {
    for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
            if (piece.shape[y][x]) {
                const newX = piece.x + x + dx;
                const newY = piece.y + y + dy;
                if (newX < 0 || newX >= cols || newY >= rows || (newY >= 0 && board[newY][newX])) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Merge piece to board
function mergePiece() {
    for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
            if (currentPiece.shape[y][x]) {
                board[currentPiece.y + y][currentPiece.x + x] = shapes.indexOf(currentPiece.shape) + 1;
            }
        }
    }
}

// Clear full lines
function clearLines() {
    let linesCleared = 0;
    for (let y = rows - 1; y >= 0; y--) {
        if (board[y].every(cell => cell !== 0)) {
            board.splice(y, 1);
            board.unshift(Array(cols).fill(0));
            linesCleared++;
            y++;
        }
    }
    if (linesCleared > 0) {
        score += linesCleared * 100;
        scoreDisplay.textContent = `Score: ${score}`;
    }
}

// Rotate piece
function rotatePiece() {
    const newShape = Array(currentPiece.shape[0].length).fill().map(() => Array(currentPiece.shape.length).fill(0));
    for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
            newShape[x][currentPiece.shape.length - 1 - y] = currentPiece.shape[y][x];
        }
    }
    const oldShape = currentPiece.shape;
    currentPiece.shape = newShape;
    if (collision(currentPiece)) {
        currentPiece.shape = oldShape;
    }
}

// Move piece
function movePiece(dx, dy) {
    currentPiece.x += dx;
    currentPiece.y += dy;
    if (collision(currentPiece)) {
        currentPiece.x -= dx;
        currentPiece.y -= dy;
        return false;
    }
    return true;
}

// Drop piece
function dropPiece() {
    if (!movePiece(0, 1)) {
        mergePiece();
        clearLines();
        currentPiece = newPiece();
        if (collision(currentPiece)) {
            gameOver();
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
    board = Array(rows).fill().map(() => Array(cols).fill(0));
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    currentPiece = newPiece();
    gameSpeed = 1000;
    gameLoop = setInterval(gameLoopFunc, gameSpeed);
}

// Main game loop
function gameLoopFunc() {
    dropPiece();
    drawBoard();
    drawPiece();
}

// Handle keyboard input
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft':
            movePiece(-1, 0);
            break;
        case 'ArrowRight':
            movePiece(1, 0);
            break;
        case 'ArrowDown':
            dropPiece();
            break;
        case 'ArrowUp':
            rotatePiece();
            break;
    }
    drawBoard();
    drawPiece();
});

// Start game
currentPiece = newPiece();
gameLoop = setInterval(gameLoopFunc, gameSpeed);
