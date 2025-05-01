const dino = document.getElementById('dino');
const obstacle = document.getElementById('obstacle');
const scoreDisplay = document.getElementById('score');
const gameOverDisplay = document.getElementById('gameOver');
const instructionsDisplay = document.getElementById('instructions');
const gameArea = document.getElementById('game');

let score = 0;
let isJumping = false;
let isGameOver = false;
let gameInterval = null;
let scoreInterval = null;

// --- JUMP FUNCTION ---
function jump() {
    // Prevent jumping if already jumping or game over
    if (isJumping || isGameOver) return;

    isJumping = true;
    dino.classList.add('jump'); // Add CSS class for animation

    // Remove the class after the animation finishes (500ms)
    setTimeout(() => {
        dino.classList.remove('jump');
        isJumping = false;
    }, 500); // Must match animation duration in CSS
}

// --- CENTRAL INPUT HANDLER ---
function handleInput() {
    if (isGameOver) {
        restarGame();
    } else {
        jump();
    }
}

// --- EVENT LISTENERS for JUMP ---
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        if (isGameOver) {
            restartGame();
        } else {
            jump();
        }
    }
});
document.addEventListener('click', () => {
     if (isGameOver) {
        restartGame();
    } else {
        jump();
    }
});

document.addEventListener('click', () => {
     if (isGameOver) {
        restartGame();
    } else {
        jump();
    }
});

document.addEventListener('touchstart', (event) => {
    // Optional: Prevent default touch behavior like scrolling if needed
    // event.preventDefault();
    if (isGameOver) {
        restartGame();
    } else {
        jump();
    }
}), { passive: true };

// --- CHECK FOR COLLISION ---
function checkCollision() {
    if (isGameOver) return; // Stop checking if game is already over

    // Get current positions
    const dinoRect = dino.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

    // Simple collision detection logic (adjust values as needed)
    // Check if obstacle is horizontally aligned with dino
    // AND if dino is low enough to hit the obstacle (not jumped over)
    if (
        obstacleRect.left < dinoRect.right &&
        obstacleRect.right > dinoRect.left &&
        obstacleRect.top < dinoRect.bottom && // Check vertical overlap
        dinoRect.bottom > obstacleRect.top // Ensure dino bottom is below obstacle top
        // A simpler check might be just based on dino's bottom position if jump height is fixed
        // && dinoRect.bottom > (gameArea.getBoundingClientRect().bottom - 55) // Example: if dino bottom is near ground level
    ) {
        // Collision detected!
        endGame();
    }
}

// --- UPDATE SCORE ---
function updateScore() {
    if (isGameOver) return; // Stop scoring if game is over
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
}

// --- START GAME ---
function startGame() {
    console.log("Starting game...");
    isGameOver = false;
    isJumping = false;
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    gameOverDisplay.style.display = 'none'; // Hide game over message
    instructionsDisplay.style.display = 'block'; // Show instructions

    // Ensure obstacle starts moving
    obstacle.classList.add('move');
    obstacle.style.animation = 'obstacleMove 1.5s linear infinite'; // Re-apply animation


    // Start game loop for collision detection (checks frequently)
    if (gameInterval) clearInterval(gameInterval); // Clear previous interval if any
    gameInterval = setInterval(checkCollision, 10); // Check every 10ms

    // Start score counter
    if (scoreInterval) clearInterval(scoreInterval); // Clear previous interval if any
    scoreInterval = setInterval(updateScore, 100); // Increase score every 100ms
}

// --- END GAME ---
function endGame() {
    console.log("Game Over!");
    isGameOver = true;
    clearInterval(gameInterval); // Stop collision checks
    clearInterval(scoreInterval); // Stop score counter

    // Stop obstacle animation visually
    obstacle.style.animationPlayState = 'paused'; // Pause animation
    // Alternative: Remove class and capture current position
    // const currentObstaclePos = obstacle.getBoundingClientRect();
    // obstacle.classList.remove('move');
    // obstacle.style.left = `${currentObstaclePos.left}px`; // Freeze position (might need adjustment based on CSS)


    gameOverDisplay.style.display = 'block'; // Show game over message
    instructionsDisplay.style.display = 'none'; // Hide jump instructions
}

// --- RESTART GAME ---
function restartGame() {
    console.log("Restarting game...");
    // Reset obstacle position visually (optional, animation reset handles it)
    // obstacle.style.right = '-30px';
    obstacle.style.animation = 'none'; // Temporarily remove animation
    void obstacle.offsetWidth; // Trigger reflow to reset animation state properly
    obstacle.style.animationPlayState = 'running'; // Ensure it runs next time

    // Restart the game logic
    startGame();
}

// --- INITIAL START ---
// Start the game automatically when the script loads
// (or you could add a start button)
startGame();