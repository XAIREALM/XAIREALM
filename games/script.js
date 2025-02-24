const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 720;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

// Load images
const marsBackground = new Image();
marsBackground.src = "images/marsbackground.jpg";

const rocketImg = new Image();
rocketImg.src = "images/rocket.png";

const crystalTop = new Image();
crystalTop.src = "images/crystaltop.png";

const crystalBottom = new Image();
crystalBottom.src = "images/crystalbottom.png";

// Track image loading
let imagesLoaded = 0;
const totalImages = 4;

function checkAllImagesLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        showMenu();
    }
}

[marsBackground, rocketImg, crystalTop, crystalBottom].forEach((img) => {
    img.onload = checkAllImagesLoaded;
    img.onerror = () => {
        console.log(`${img.src} could not be loaded, a box will be drawn instead.`);
        checkAllImagesLoaded();
    };
});

// Game variables
let rocket = {
    x: CANVAS_WIDTH * 0.2,
    y: CANVAS_HEIGHT / 2,
    width: CANVAS_WIDTH * 0.06,
    height: CANVAS_HEIGHT * 0.05,
    velocity: 0,
    gravity: 0,
    jump: -8
};

let crystals = [];
let frame = 0;
let score = 0;
let gameOver = false;
let gameStarted = false;
let inMenu = true;

// Crystal settings
const crystalGap = CANVAS_HEIGHT * 0.33;
const crystalWidth = CANVAS_WIDTH * 0.1;

// Button sizes (for menu)
const buttonWidth = CANVAS_WIDTH * 0.156; // ~200px
const buttonHeight = CANVAS_HEIGHT * 0.083; // ~60px

// Keyboard controls
document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && gameStarted && !gameOver) {
        rocket.velocity = rocket.jump;
        rocket.gravity = 0.3;
    }
    if (e.code === "Enter" && gameOver) {
        resetGame();
        gameStarted = true;
        inMenu = false;
        gameLoop();
    }
});

// Click controls
canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (inMenu) {
        // Play button
        if (
            clickX >= CANVAS_WIDTH / 2 - buttonWidth / 2 &&
            clickX <= CANVAS_WIDTH / 2 + buttonWidth / 2 &&
            clickY >= CANVAS_HEIGHT / 2 - buttonHeight / 2 &&
            clickY <= CANVAS_HEIGHT / 2 + buttonHeight / 2
        ) {
            inMenu = false;
            gameStarted = true;
            rocket.gravity = 0.3;
            rocket.velocity = rocket.jump;
            gameLoop();
        }
        // Back button
        if (
            clickX >= CANVAS_WIDTH / 2 - buttonWidth / 2 &&
            clickX <= CANVAS_WIDTH / 2 + buttonWidth / 2 &&
            clickY >= CANVAS_HEIGHT / 2 + buttonHeight &&
            clickY <= CANVAS_HEIGHT / 2 + buttonHeight * 2
        ) {
            window.location.href = "../index.html";
        }
    } else if (gameStarted && !gameOver) {
        rocket.velocity = rocket.jump;
        rocket.gravity = 0.3;
    } else if (gameOver) {
        resetGame();
        gameStarted = true;
        inMenu = false;
        gameLoop();
    }
});

// Fullscreen button
const fullscreenBtn = document.getElementById("fullscreenBtn");
fullscreenBtn.addEventListener("click", () => {
    if (canvas.requestFullscreen) {
        canvas.requestFullscreen();
    } else if (canvas.mozRequestFullScreen) {
        canvas.mozRequestFullScreen();
    } else if (canvas.webkitRequestFullscreen) {
        canvas.webkitRequestFullscreen();
    } else if (canvas.msRequestFullscreen) {
        canvas.msRequestFullscreen();
    }
});

// Create crystals
function spawnCrystal() {
    let height = Math.random() * (CANVAS_HEIGHT - crystalGap - CANVAS_HEIGHT * 0.16) + CANVAS_HEIGHT * 0.08;
    crystals.push({
        x: CANVAS_WIDTH,
        topHeight: height,
        bottomHeight: CANVAS_HEIGHT - height - crystalGap,
        passed: false
    });
}

// Collision detection
function checkCollision() {
    for (let crystal of crystals) {
        if (
            rocket.x + rocket.width > crystal.x &&
            rocket.x < crystal.x + crystalWidth &&
            (rocket.y < crystal.topHeight || rocket.y + rocket.height > CANVAS_HEIGHT - crystal.bottomHeight)
        ) {
            return true;
        }
    }
    if (rocket.y <= 0 || rocket.y + rocket.height >= CANVAS_HEIGHT) {
        return true;
    }
    return false;
}

// Reset game
function resetGame() {
    rocket.y = CANVAS_HEIGHT / 2;
    rocket.velocity = 0;
    rocket.gravity = 0;
    crystals = [];
    score = 0;
    gameOver = false;
    frame = 0;
}

// Show menu
function showMenu() {
    if (marsBackground.complete) {
        ctx.drawImage(marsBackground, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    } else {
        ctx.fillStyle = "orange";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    // Title
    ctx.fillStyle = "white";
    ctx.font = `${CANVAS_WIDTH * 0.05}px Arial`;
    ctx.fillText("Rocket Mars", CANVAS_WIDTH / 2 - CANVAS_WIDTH * 0.15, CANVAS_HEIGHT / 2 - CANVAS_HEIGHT * 0.2);

    // Play button
    ctx.fillStyle = "green";
    ctx.fillRect(CANVAS_WIDTH / 2 - buttonWidth / 2, CANVAS_HEIGHT / 2 - buttonHeight / 2, buttonWidth, buttonHeight);
    ctx.fillStyle = "white";
    ctx.font = `${CANVAS_WIDTH * 0.025}px Arial`;
    ctx.fillText("Play", CANVAS_WIDTH / 2 - CANVAS_WIDTH * 0.03, CANVAS_HEIGHT / 2 + CANVAS_HEIGHT * 0.015);

    // Back button
    ctx.fillStyle = "red";
    ctx.fillRect(CANVAS_WIDTH / 2 - buttonWidth / 2, CANVAS_HEIGHT / 2 + buttonHeight, buttonWidth, buttonHeight);
    ctx.fillStyle = "white";
    ctx.font = `${CANVAS_WIDTH * 0.025}px Arial`;
    ctx.fillText("Back", CANVAS_WIDTH / 2 - CANVAS_WIDTH * 0.03, CANVAS_HEIGHT / 2 + buttonHeight + CANVAS_HEIGHT * 0.065);

    if (rocketImg.complete) {
        ctx.drawImage(rocketImg, rocket.x, rocket.y, rocket.width, rocket.height);
    } else {
        ctx.fillStyle = "red";
        ctx.fillRect(rocket.x, rocket.y, rocket.width, rocket.height);
    }

    requestAnimationFrame(showMenu);
}

// Game loop
function gameLoop() {
    if (inMenu || !gameStarted) {
        return;
    }

    if (gameOver) {
        ctx.fillStyle = "white";
        ctx.font = `${CANVAS_WIDTH * 0.05}px Arial`;
        ctx.fillText("Game Over!", CANVAS_WIDTH / 2 - CANVAS_WIDTH * 0.15, CANVAS_HEIGHT / 2 - CANVAS_HEIGHT * 0.03);
        ctx.font = `${CANVAS_WIDTH * 0.025}px Arial`;
        ctx.fillText("Score: " + score, CANVAS_WIDTH / 2 - CANVAS_WIDTH * 0.05, CANVAS_HEIGHT / 2 + CANVAS_HEIGHT * 0.03);
        ctx.fillText("Click or Press Enter to Restart", CANVAS_WIDTH / 2 - CANVAS_WIDTH * 0.15, CANVAS_HEIGHT / 2 + CANVAS_HEIGHT * 0.1);
        return;
    }

    // Background drawing
    if (marsBackground.complete) {
        ctx.drawImage(marsBackground, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    } else {
        ctx.fillStyle = "orange";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    // Rocket drawing
    if (rocketImg.complete) {
        ctx.drawImage(rocketImg, rocket.x, rocket.y, rocket.width, rocket.height);
    } else {
        ctx.fillStyle = "red";
        ctx.fillRect(rocket.x, rocket.y, rocket.width, rocket.height);
    }
    rocket.velocity += rocket.gravity;
    rocket.y += rocket.velocity;

    // Crystal spawn and movement
    if (frame % 100 === 0) {
        spawnCrystal();
    }
    for (let i = crystals.length - 1; i >= 0; i--) {
        crystals[i].x -= CANVAS_WIDTH * 0.0025;

        // Crystal drawing
        if (crystalTop.complete) {
            ctx.drawImage(crystalTop, crystals[i].x, 0, crystalWidth, crystals[i].topHeight);
        } else {
            ctx.fillStyle = "blue";
            ctx.fillRect(crystals[i].x, 0, crystalWidth, crystals[i].topHeight);
        }
        if (crystalBottom.complete) {
            ctx.drawImage(crystalBottom, crystals[i].x, CANVAS_HEIGHT - crystals[i].bottomHeight, crystalWidth, crystals[i].bottomHeight);
        } else {
            ctx.fillStyle = "blue";
            ctx.fillRect(crystals[i].x, CANVAS_HEIGHT - crystals[i].bottomHeight, crystalWidth, crystals[i].bottomHeight);
        }

        // Score increment
        if (crystals[i].x + crystalWidth < rocket.x && !crystals[i].passed) {
            score++;
            crystals[i].passed = true;
        }

        // Remove crystals
        if (crystals[i].x + crystalWidth < 0) {
            crystals.splice(i, 1);
        }
    }

    // Score display
    ctx.fillStyle = "white";
    ctx.font = `${CANVAS_WIDTH * 0.025}px Arial`;
    ctx.fillText("Score: " + score, CANVAS_WIDTH * 0.0125, CANVAS_HEIGHT * 0.05);

    // Collision check
    if (checkCollision()) {
        gameOver = true;
    }

    frame++;
    requestAnimationFrame(gameLoop);
}

// Wait for images to load, show menu if there's an error
setTimeout(() => {
    if (imagesLoaded < totalImages) {
        console.log("Some images could not be loaded, showing menu.");
        showMenu();
    }
}, 5000);

// Show menu initially
showMenu();