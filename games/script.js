const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Canvas’ı tam ekran yap
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Pencere boyutu değiştiğinde canvas’ı güncelle
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Görselleri yükle
const marsBackground = new Image();
marsBackground.src = "images/marsbackground.jpg";

const rocketImg = new Image();
rocketImg.src = "images/rocket.png";

const crystalTop = new Image();
crystalTop.src = "images/crystaltop.png";

const crystalBottom = new Image();
crystalBottom.src = "images/crystalbottom.png";

const marsGround = new Image();
marsGround.src = "images/marsground.png";

// Görsellerin yüklenme durumunu takip et
let imagesLoaded = 0;
const totalImages = 5;

function checkAllImagesLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        gameLoop();
    }
}

// Hata durumunda görsel yüklenmeden devam et
[marsBackground, rocketImg, crystalTop, crystalBottom, marsGround].forEach((img) => {
    img.onload = checkAllImagesLoaded;
    img.onerror = () => {
        console.log(`${img.src} yüklenemedi, yerine kutu çizilecek.`);
        checkAllImagesLoaded();
    };
});

// Oyun değişkenleri
let rocket = {
    x: window.innerWidth * 0.2, // Ekranın %20’si kadar solda başlar
    y: window.innerHeight / 2,
    width: window.innerWidth * 0.06, // Ekran genişliğinin %6’sı
    height: window.innerHeight * 0.05, // Ekran yüksekliğinin %5’i
    velocity: 0,
    gravity: 0.2, // Daha yavaş düşüş için azaltıldı
    jump: -8 // Zıplama gücü dengelendi
};

let crystals = [];
let frame = 0;
let score = 0;
let gameOver = false;

// Kristal ayarları
const crystalGap = window.innerHeight * 0.33; // Ekran yüksekliğinin 1/3’ü kadar boşluk
const crystalWidth = window.innerWidth * 0.1; // Ekran genişliğinin %10’u

// Klavye kontrolü
document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !gameOver) {
        rocket.velocity = rocket.jump;
    }
    if (e.code === "Enter" && gameOver) {
        resetGame();
        gameLoop(); // Enter ile yeniden başlat
    }
});

// Kristal oluşturma
function spawnCrystal() {
    let height = Math.random() * (window.innerHeight - crystalGap - window.innerHeight * 0.16) + window.innerHeight * 0.08;
    crystals.push({
        x: window.innerWidth,
        topHeight: height,
        bottomHeight: window.innerHeight - height - crystalGap,
        passed: false
    });
}

// Çarpışma kontrolü
function checkCollision() {
    for (let crystal of crystals) {
        if (
            rocket.x + rocket.width > crystal.x &&
            rocket.x < crystal.x + crystalWidth &&
            (rocket.y < crystal.topHeight || rocket.y + rocket.height > window.innerHeight - crystal.bottomHeight)
        ) {
            return true;
        }
    }
    if (rocket.y <= 0 || rocket.y + rocket.height >= window.innerHeight) {
        return true;
    }
    return false;
}

// Oyunu sıfırlama
function resetGame() {
    rocket.y = window.innerHeight / 2;
    rocket.velocity = 0;
    crystals = [];
    score = 0;
    gameOver = false;
    frame = 0;
}

// Oyun döngüsü
function gameLoop() {
    if (gameOver) {
        ctx.fillStyle = "white";
        ctx.font = `${window.innerWidth * 0.05}px Arial`; // Yazı boyutu ekran genişliğine göre ölçeklenir
        ctx.fillText("Game Over!", window.innerWidth / 2 - window.innerWidth * 0.15, window.innerHeight / 2 - window.innerHeight * 0.03);
        ctx.font = `${window.innerWidth * 0.025}px Arial`;
        ctx.fillText("Score: " + score, window.innerWidth / 2 - window.innerWidth * 0.05, window.innerHeight / 2 + window.innerHeight * 0.03);
        ctx.fillText("Press Enter to Restart", window.innerWidth / 2 - window.innerWidth * 0.125, window.innerHeight / 2 + window.innerHeight * 0.1);
        return;
    }

    // Arkaplan çizimi
    if (marsBackground.complete) {
        ctx.drawImage(marsBackground, 0, 0, window.innerWidth, window.innerHeight);
    } else {
        ctx.fillStyle = "orange";
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    }

    // Roket çizimi
    if (rocketImg.complete) {
        ctx.drawImage(rocketImg, rocket.x, rocket.y, rocket.width, rocket.height);
    } else {
        ctx.fillStyle = "red";
        ctx.fillRect(rocket.x, rocket.y, rocket.width, rocket.height);
    }
    rocket.velocity += rocket.gravity;
    rocket.y += rocket.velocity;

    // Kristal spawn ve hareket
    if (frame % 100 === 0) {
        spawnCrystal();
    }
    for (let i = crystals.length - 1; i >= 0; i--) {
        crystals[i].x -= window.innerWidth * 0.0025; // Ekran genişliğine göre hız
        if (crystalTop.complete) {
            ctx.drawImage(crystalTop, crystals[i].x, 0, crystalWidth, crystals[i].topHeight);
        } else {
            ctx.fillStyle = "blue";
            ctx.fillRect(crystals[i].x, 0, crystalWidth, crystals[i].topHeight);
        }
        if (crystalBottom.complete) {
            ctx.drawImage(crystalBottom, crystals[i].x, window.innerHeight - crystals[i].bottomHeight, crystalWidth, crystals[i].bottomHeight);
        } else {
            ctx.fillStyle = "blue";
            ctx.fillRect(crystals[i].x, window.innerHeight - crystals[i].bottomHeight, crystalWidth, crystals[i].bottomHeight);
        }

        // Skor artırma
        if (crystals[i].x + crystalWidth < rocket.x && !crystals[i].passed) {
            score++;
            crystals[i].passed = true;
        }

        // Kristalleri temizle
        if (crystals[i].x + crystalWidth < 0) {
            crystals.splice(i, 1);
        }
    }

    // Mars zemini çizimi
    if (marsGround.complete) {
        ctx.drawImage(marsGround, 0, window.innerHeight - window.innerHeight * 0.083, window.innerWidth, window.innerHeight * 0.083);
    } else {
        ctx.fillStyle = "brown";
        ctx.fillRect(0, window.innerHeight - window.innerHeight * 0.083, window.innerWidth, window.innerHeight * 0.083);
    }

    // Skor gösterimi
    ctx.fillStyle = "white";
    ctx.font = `${window.innerWidth * 0.025}px Arial`;
    ctx.fillText("Score: " + score, window.innerWidth * 0.0125, window.innerHeight * 0.05);

    // Çarpışma kontrolü
    if (checkCollision()) {
        gameOver = true;
    }

    frame++;
    requestAnimationFrame(gameLoop);
}

// Görsellerin yüklenmesini bekle, hata olursa da başla
setTimeout(() => {
    if (imagesLoaded < totalImages) {
        console.log("Bazı görseller yüklenemedi, oyun yine de başlıyor.");
        gameLoop();
    }
}, 5000);