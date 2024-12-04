const boardSize = 20;
const gameBoard = document.getElementById("game-board");

let snake = [{ x: 10, y: 10 }];
let apple = { x: 15, y: 15 };
let direction = { x: 0, y: 0 };
let lastDirection = { x: 0, y: 0 };
let grow = false;
let speed = 300; // Starting speed in milliseconds
let speedIncreaseFactor = 1.025; // Speed multiplier for each apple eaten
let gameInterval;
let appleCount = 0;

function main() {
    startGameLoop();
    window.addEventListener("keydown", changeDirection);
}

function startGameLoop() {
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, speed);
}

function gameLoop() {
    moveSnake();
    if (checkCollision()) {
        alert(`Game Over! You ate ${appleCount} apple(s).`);
        resetGame();
    }
    updateGameBoard();
}

function changeDirection(event) {
    const key = event.key.toLowerCase();
    const isArrow = key.startsWith("arrow");
    const dir = isArrow ? key.slice(5) : key;

    if (dir === "w" && lastDirection.y === 0) direction = { x: 0, y: -1 };
    else if (dir === "s" && lastDirection.y === 0) direction = { x: 0, y: 1 };
    else if (dir === "a" && lastDirection.x === 0) direction = { x: -1, y: 0 };
    else if (dir === "d" && lastDirection.x === 0) direction = { x: 1, y: 0 };
    else if (dir === "up" && lastDirection.y === 0) direction = { x: 0, y: -1 };
    else if (dir === "down" && lastDirection.y === 0) direction = { x: 0, y: 1 };
    else if (dir === "left" && lastDirection.x === 0) direction = { x: -1, y: 0 };
    else if (dir === "right" && lastDirection.x === 0) direction = { x: 1, y: 0 };
}

function moveSnake() {
    lastDirection = direction;
    const newHead = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y,
    };

    if (newHead.x === apple.x && newHead.y === apple.y) {
        grow = true;
        moveApple();
        appleCount++;
        increaseSpeed();
    }

    if (!grow) snake.pop();
    else grow = false;

    snake.unshift(newHead);
}

function checkCollision() {
    const head = snake[0];
    const bodyCollision = snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
    const wallCollision = head.x < 0 || head.x >= boardSize || head.y < 0 || head.y >= boardSize;
    return bodyCollision || wallCollision;
}

function moveApple() {
    apple = {
        x: Math.floor(Math.random() * boardSize),
        y: Math.floor(Math.random() * boardSize),
    };
}

function updateGameBoard() {
    gameBoard.innerHTML = "";
    snake.forEach((segment, index) => {
        const snakeElement = document.createElement("div");
        snakeElement.style.gridRowStart = segment.y + 1;
        snakeElement.style.gridColumnStart = segment.x + 1;
        snakeElement.classList.add(index === 0 ? "snake-head" : "snake");
        gameBoard.appendChild(snakeElement);
    });

    const appleElement = document.createElement("div");
    appleElement.style.gridRowStart = apple.y + 1;
    appleElement.style.gridColumnStart = apple.x + 1;
    appleElement.classList.add("apple");
    gameBoard.appendChild(appleElement);
}

function increaseSpeed() {
    speed /= speedIncreaseFactor; // Reduce interval time
    startGameLoop(); // Restart the game loop with new speed
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    apple = { x: 15, y: 15 };
    direction = { x: 0, y: 0 };
    lastDirection = { x: 0, y: 0 };
    speed = 300; // Reset speed
    appleCount = 0; // Reset apple count
    startGameLoop();
}

main();
