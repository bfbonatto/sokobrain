const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function clearAll() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function square(x, y, size, color) {
  ctx.beginPath();
  ctx.rect(x - size / 2, y - size / 2, size, size);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

function circle(x, y, radius, color) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

function sprite(x, y, img, scale = 1) { }

class Empty {
  constructor() {
    this.isEmpty = true;
  }
  draw(x, y) { }
}
class Player {
  constructor() { }
  draw(x, y) {
    circle(x, y, 15, "green");
  }
}

class Enemy {
  constructor() { }
  draw(x, y) {
    circle(x, y, 15, "red");
  }
}

class Grid {
  constructor(squareSize, width, height) {
    this.size = squareSize;
    this.width = width;
    this.height = height;
    this.slots = [];
    for (var i = 0; i < width; i++) {
      this.slots.push([]);
      for (var j = 0; j < height; j++) {
        this.slots[i].push(new Empty());
      }
    }
  }
  draw(xStart, yStart) {
    drawGrid(this.size, this.width, this.height, xStart, yStart);
    for (var i = 0; i < this.width; i++) {
      for (var j = 0; j < this.height; j++) {
        const offset = this.centerOf(i, j);
        const element = this.at(i, j);
        element.draw(xStart + offset.x, yStart + offset.y);
      }
    }
  }
  centerOf(x, y) {
    return {
      x: x * this.size + this.size / 2,
      y: y * this.size + this.size / 2
    };
  }
  at(x, y) {
    return this.slots[x][y];
  }
  add(x, y, element) {
    this.slots[x][y] = element;
  }
}

function drawGrid(squareSize, width, height, xStart, yStart, color = "black") {
  ctx.strokeStyle = color;
  for (var i = 0; i <= width; i++) {
    ctx.moveTo(xStart + i * squareSize, yStart);
    ctx.lineTo(xStart + i * squareSize, yStart + height * squareSize);
    ctx.stroke();
  }
  for (var i = 0; i <= height; i++) {
    ctx.moveTo(xStart, yStart + i * squareSize);
    ctx.lineTo(xStart + width * squareSize, yStart + i * squareSize);
    ctx.stroke();
  }
}

function keyDownHandler(event) {
}
function keyUpHandler(event) {
}

const board = new Grid(40, 10, 10);
board.add(0, 0, new Player());
board.add(5, 5, new Enemy());
board.add(6, 6, new Enemy());

function draw() {
  clearAll();
  board.draw(300, 100);
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

requestAnimationFrame(draw);
