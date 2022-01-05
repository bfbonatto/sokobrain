let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

var playerX = 480;
var playerY = 320;

var right = false;
var left = false;
var up = false;
var down = false;

function square(x, y, size, color) {
  ctx.beginPath();
  ctx.rect(x - size / 2, y - size / 2, size, size);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

function keyDownHandler(event) {
  if (event.keyCode == 40) {
    down = true;
  }
  if (event.keyCode == 39) {
    right = true;
  }
  if (event.keyCode == 38) {
    up = true;
  }
  if (event.keyCode == 37) {
    left = true;
  }
}
function keyUpHandler(event) {
  if (event.keyCode == 40) {
    down = false;
  }
  if (event.keyCode == 39) {
    right = false;
  }
  if (event.keyCode == 38) {
    up = false;
  }
  if (event.keyCode == 37) {
    left = false;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (right) {
    playerX += 10;
  }
  if (left) {
    playerX -= 10;
  }
  if (down) {
    playerY += 10;
  }
  if (up) {
    playerY -= 10;
  }
  square(playerX, playerY, 50, "red");
  requestAnimationFrame(draw);
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

requestAnimationFrame(draw);
