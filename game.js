const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game modes
let mode = "topdown"; // or "sidescroll"
let keys = {};
let frame = 0;

document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

// PLAYER SHARED STATE
const player = {
  x: 50,
  y: 50,
  w: 30,
  h: 30,
  vx: 0,
  vy: 0,
  onGround: false,
  speed: 2.5,
  gravity: 0.5,
  jumpPower: -9,
  color: "#0ff",
};

// --- TOPDOWN LEVEL (room layout) ---
const gridSize = 50;
const topdownMap = [
  "################",
  "#..............#",
  "#..@...........#",
  "#..............#",
  "#......S.......#",
  "#..............#",
  "#..............#",
  "################"
];

// SIDE-SCROLL PLATFORMER LEVEL
const platforms = [
  {x: 0, y: 570, w: 900, h: 30},
  {x: 200, y: 500, w: 100, h: 10},
  {x: 400, y: 450, w: 100, h: 10},
  {x: 650, y: 400, w: 150, h: 10}
];

let switchActivated = false;

function drawTopdown() {
  for (let row = 0; row < topdownMap.length; row++) {
    for (let col = 0; col < topdownMap[row].length; col++) {
      const tile = topdownMap[row][col];
      let color = "#333";

      if (tile === "#") color = "#888";
      if (tile === "S") color = "#0f0";

      ctx.fillStyle = color;
      ctx.fillRect(col * gridSize, row * gridSize, gridSize, gridSize);
    }
  }

  // Movement
  if (keys["w"] || keys["ArrowUp"]) player.y -= player.speed;
  if (keys["s"] || keys["ArrowDown"]) player.y += player.speed;
  if (keys["a"] || keys["ArrowLeft"]) player.x -= player.speed;
  if (keys["d"] || keys["ArrowRight"]) player.x += player.speed;

  // Check switch tile
  const tileX = Math.floor(player.x / gridSize);
  const tileY = Math.floor(player.y / gridSize);
  if (topdownMap[tileY]?.[tileX] === "S") {
    mode = "sidescroll";
    player.x = 50;
    player.y = 500;
    player.vy = 0;
  }

  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.w, player.h);
}

function drawSidescroll() {
  // Gravity
  player.vy += player.gravity;
  player.onGround = false;

  player.x += player.vx;
  player.y += player.vy;

  if (keys["a"] || keys["ArrowLeft"]) player.vx = -player.speed;
  else if (keys["d"] || keys["ArrowRight"]) player.vx = player.speed;
  else player.vx = 0;

  if ((keys["w"] || keys[" "]) && player.onGround) {
    player.vy = player.jumpPower;
    player.onGround = false;
  }

  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw platforms
  platforms.forEach(p => {
    ctx.fillStyle = "#888";
    ctx.fillRect(p.x, p.y, p.w, p.h);

    // Collision
    if (
      player.x + player.w > p.x &&
      player.x < p.x + p.w &&
      player.y + player.h > p.y &&
      player.y + player.h < p.y + p.h + 10 &&
      player.vy >= 0
    ) {
      player.y = p.y - player.h;
      player.vy = 0;
      player.onGround = true;
    }
  });

  // Switch
  ctx.fillStyle = switchActivated ? "#0f0" : "#f00";
  ctx.fillRect(800, 370, 30, 30);

  if (
    player.x < 830 && player.x + player.w > 800 &&
    player.y + player.h > 370 && player.y < 400
  ) {
    switchActivated = true;
  }

  // Exit door
  if (switchActivated) {
    ctx.fillStyle = "#0ff";
    ctx.fillRect(850, 350, 30, 100);
    if (player.x > 850 && player.y > 350) {
      alert("You Escaped! Level Complete!");
      document.location.reload();
    }
  }

  // Draw player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.w, player.h);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (mode === "topdown") drawTopdown();
  else if (mode === "sidescroll") drawSidescroll();

  frame++;
  requestAnimationFrame(gameLoop);
}

gameLoop();
