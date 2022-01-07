const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function clearAll() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawSquare(center, length, color) {
  ctx.beginPath();
  ctx.rect(center.x - length / 2, center.y - length / 2, length, length);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

function drawCircle(center, radius, color) {
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

function drawLine(p1, p2, color) {
  ctx.strokeStyle = color;
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

function keyDownHandler(event) {
}
function keyUpHandler(event) {
}

function draw() {
  clearAll();
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

requestAnimationFrame(draw);
