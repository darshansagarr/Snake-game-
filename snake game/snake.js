// Snake Game with Score Tracking

// Get the canvas element and set up the context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game settings
const box = 20; // Size of the snake and food
const canvasSize = Math.min(window.innerWidth, window.innerHeight) * 0.8;
canvas.width = canvasSize;
canvas.height = canvasSize;

// Initialize variables
let snake = [{ x: 200, y: 200 }];
let direction = "RIGHT";
let food = generateFood();
let score = 0;
let playerName = prompt("Enter your name:") || "Player";

// Event listener for keypress
window.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    const key = event.keyCode;
    if (key === 37 && direction !== "RIGHT") direction = "LEFT";
    else if (key === 38 && direction !== "DOWN") direction = "UP";
    else if (key === 39 && direction !== "LEFT") direction = "RIGHT";
    else if (key === 40 && direction !== "UP") direction = "DOWN";
}

function generateFood() {
    return {
        x: Math.floor(Math.random() * (canvasSize / box)) * box,
        y: Math.floor(Math.random() * (canvasSize / box)) * box,
    };
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // Draw food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // Draw snake
    ctx.fillStyle = "lime";
    snake.forEach((segment) => {
        ctx.fillRect(segment.x, segment.y, box, box);
    });

    // Draw score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 20);

    // Move snake
    let newHead = { ...snake[0] };
    if (direction === "LEFT") newHead.x -= box;
    if (direction === "UP") newHead.y -= box;
    if (direction === "RIGHT") newHead.x += box;
    if (direction === "DOWN") newHead.y += box;

    // Collision detection
    if (newHead.x < 0 || newHead.x >= canvasSize || 
        newHead.y < 0 || newHead.y >= canvasSize || 
        snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        
        saveScore(playerName, score);  // Save score when game ends
        alert(`Game Over! ${playerName}'s Score: ${score}`);
        showLeaderboard();  // Display leaderboard

        snake = [{ x: 200, y: 200 }];
        direction = "RIGHT";
        food = generateFood();
        score = 0;  // Reset score
        return;
    }

    // Check if snake eats food
    if (newHead.x === food.x && newHead.y === food.y) {
        score += 10;  // Increase score
        food = generateFood();
    } else {
        snake.pop(); // Remove last segment
    }

    // Add new head
    snake.unshift(newHead);
}

// Save score to localStorage
function saveScore(player, playerScore) {
    let scores = JSON.parse(localStorage.getItem("snakeGameScores")) || [];
    scores.push({ name: player, score: playerScore });
    scores.sort((a, b) => b.score - a.score); // Sort highest to lowest
    localStorage.setItem("snakeGameScores", JSON.stringify(scores));
}

// Show leaderboard
function showLeaderboard() {
    let scores = JSON.parse(localStorage.getItem("snakeGameScores")) || [];
    let leaderboard = "🏆 Leaderboard 🏆\n\n";
    
    scores.slice(0, 5).forEach((entry, index) => {
        leaderboard += `${index + 1}. ${entry.name} - ${entry.score}\n`;
    });

    alert(leaderboard);
}

// Game loop
setInterval(draw, 100);
