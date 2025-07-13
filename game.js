const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let keys = {};
document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

const player = {
  x: 50,
  y: 400,
  w: 30,
  h: 30,
  speed: 3,
  crouch: false,
  draw() {
    ctx.fillStyle = this.crouch ? "#0f0" : "#00f";
    ctx.fillRect(this.x, this.y, this.w, this.h);
  },
  update() {
    if (keys["ArrowRight"] || keys["d"]) this.x += this.speed;
    if (keys["ArrowLeft"] || keys["a"]) this.x -= this.speed;
    if (keys["ArrowUp"] || keys["w"]) this.y -= this.speed;
    if (keys["ArrowDown"] || keys["s"]) this.y += this.speed;
    this.crouch = keys["Shift"];
  }
};

const guard = {
  x: 300,
  y: 250,
  w: 30,
  h: 30,
  speed: 2,
  dir: 1,
  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.w, this.h);
  },
  update() {
    this.x += this.speed * this.dir;
    if (this.x > 700 || this.x < 100) this.dir *= -1;
  }
};

function checkCollision(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x &&
         a.y < b.y + b.h && a.y + a.h > b.y;
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  player.update();
  guard.update();

  if (checkCollision(player, guard)) {
    alert("Caught by the guard! Game Over!");
    document.location.reload();
  }

  player.draw();
  guard.draw();

  requestAnimationFrame(gameLoop);
}

gameLoop();
