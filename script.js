const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = {
  x: 180,
  y: 550,
  width: 40,
  height: 40,
  color: "lime",
  speed: 2
};

let gameRunning = false;
let greenLight = false;
let statusText = document.getElementById("status");
let intervalId;
let keys = {};
let gameOver = false;
let gameWon = false;

document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

function startGame() {
  player.y = 550;
  gameRunning = true;
  gameOver = false;
  gameWon = false;
  statusText.textContent = "Green Light!";
  greenLight = true;
  intervalId = setInterval(toggleLight, 2000 + Math.random() * 2000);
  gameLoop();
}

function toggleLight() {
  greenLight = !greenLight;
  statusText.textContent = greenLight ? "Green Light! 🟢" : "Red Light! 🔴";
}

function update() {
  if (!gameRunning || gameOver || gameWon) return;

  if ((keys["ArrowUp"] || keys["w"]) && greenLight) {
    player.y -= player.speed;
  } else if ((keys["ArrowUp"] || keys["w"]) && !greenLight) {
    // Player moved during red light
    gameOver = true;
    gameRunning = false;
    clearInterval(intervalId);
    statusText.textContent = "You moved on Red Light! 💀 GAME OVER!";
  }

  if (player.y <= 20) {
    gameWon = true;
    gameRunning = false;
    clearInterval(intervalId);
    statusText.textContent = "You Win! 🏁";
  }
}

function drawDoll() {
  ctx.fillStyle = greenLight ? "green" : "red";
  ctx.beginPath();
  ctx.arc(200, 60, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "12px Arial";
  ctx.fillText("👧", 190, 65);
}

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawFinishLine() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 10, canvas.width, 5);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawFinishLine();
  drawDoll();
  drawPlayer();
}

function gameLoop() {
  update();
  draw();
  if (!gameOver && !gameWon) {
    requestAnimationFrame(gameLoop);
  }
}
