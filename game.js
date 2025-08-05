const player = document.getElementById("player");
const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const levelDisplay = document.getElementById("level");
const fog = document.getElementById("fog");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const menuBtn = document.getElementById("menuBtn");
const mainMenu = document.getElementById("mainMenu");
const scoreSound = document.getElementById("scoreSound");


let score = 0;
let level = 1;
let highScore = localStorage.getItem("highScore") || 0;
highScoreDisplay.textContent = highScore;

let gameInterval;
let speed = 3;
let lanes = ["35%", "50%", "65%"];
let canMove = true;

function startGame() {
    mainMenu.style.display = "none";
    gameArea.style.display = "block";
    score = 0;
    level = 1;
    speed = 3;
    scoreDisplay.textContent = score;
    levelDisplay.textContent = level;
    player.style.left = "50%";
    player.style.top = "80%";
    gameInterval = setInterval(gameLoop, 20);
    spawnObstacle();
}

function gameLoop() {
    moveObstacles();
    checkCollisions();
    updateScore();
    handleLevel();
}

function spawnObstacle() {
    const obs = document.createElement("div");
    obs.classList.add("obstacle");
    obs.style.left = lanes[Math.floor(Math.random() * lanes.length)];
    obs.style.top = "-100px";
    gameArea.appendChild(obs);
    setTimeout(spawnObstacle, 1500 - level * 100);
}

function moveObstacles() {
    document.querySelectorAll(".obstacle").forEach(obstacle => {
        let top = parseInt(obstacle.style.top);
        if (top > window.innerHeight) obstacle.remove();
        else obstacle.style.top = top + speed + "px";
    });

    document.querySelectorAll(".level-line").forEach(line => {
        let top = parseInt(line.style.top);
        if (top > window.innerHeight) line.remove();
        else line.style.top = top + speed + "px";
    });
}

function checkCollisions() {
    const playerRect = player.getBoundingClientRect();
    document.querySelectorAll(".obstacle").forEach(obstacle => {
        const obsRect = obstacle.getBoundingClientRect();
        if (!(playerRect.right < obsRect.left || playerRect.left > obsRect.right || playerRect.bottom < obsRect.top || playerRect.top > obsRect.bottom)) {
            crash();
        }
    });
}

function updateScore() {
    score++;
    scoreDisplay.textContent = score;

    if (score % 10 === 0) scoreSound.play();
}


function handleLevel() {
    let newLevel = 1;
    if (score >= 50) newLevel = 2;
    if (score >= 500) newLevel = 3;
    if (score >= 1000) newLevel = 4;
    if (score >= 2000) newLevel = 5;
    if (score >= 5000) newLevel = 6;
    if (score >= 10000) newLevel = 7;
    if (score >= 15000) newLevel = 8;

    if (newLevel > level) {
        level = newLevel;
        levelDisplay.textContent = level;
        speed += level < 5 ? 1 : level < 8 ? 2 : 3;

        const line = document.createElement("div");
        line.classList.add("level-line");
        line.style.top = "0px";
        gameArea.appendChild(line);
    }
}

function crash() {
    clearInterval(gameInterval);
    document.body.classList.add("crash");

    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
        highScoreDisplay.textContent = highScore;
    }

    document.querySelector(".restartBtn-card").style.display = "flex";
}

// ==== Boshqaruv (Klaviatura uchun - faqat PC) ====
document.addEventListener("keydown", e => {
    if (!canMove) return;
    if (window.innerWidth > 768) { // faqat katta ekranlar (PC)
        if (e.key === "ArrowLeft") movePlayer(-1);
        else if (e.key === "ArrowRight") movePlayer(1);
        else if (e.key === "ArrowUp") moveForward();
        else if (e.key === "ArrowDown") moveBackward();
    }
});

function movePlayer(direction) {
    const currentIndex = lanes.findIndex(pos => pos === player.style.left);
    let newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < lanes.length) {
        player.style.left = lanes[newIndex];
    }
}

function moveForward() {
    let top = parseFloat(player.style.top);
    if (top > 10) player.style.top = (top - 5) + "%";
}

function moveBackward() {
    let top = parseFloat(player.style.top);
    if (top < 90) player.style.top = (top + 5) + "%";
}

// ==== Mobil qurilmalar uchun ekran tugmalari ====
if (window.innerWidth <= 768) {
    const controls = document.createElement("div");
    controls.id = "mobileControls";
    controls.innerHTML = `
        <button onclick="movePlayer(-1)">⬅️</button>
        <button onclick="moveForward()">⬆️</button>
        <button onclick="moveBackward()">⬇️</button>
        <button onclick="movePlayer(1)">➡️</button>
    `;
    document.body.appendChild(controls);
}

// === Tugmalar ===
startBtn.onclick = startGame;

restartBtn.onclick = () => location.reload();

menuBtn.onclick = () => location.reload();
