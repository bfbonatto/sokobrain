const canvas = <HTMLCanvasElement>document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function clearAll() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawSquare(center: Point, length: number, color: string) {
  ctx.beginPath();
  ctx.rect(center.x - length / 2, center.y - length / 2, length, length);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

function drawCircle(center: Point, radius: number, color: string) {
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

function drawLine(p1: Point, p2: Point, color: string) {
  ctx.strokeStyle = color;
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
}

class Point {
  x: number;
  y: number;
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  add(other: Point): Point {
    return new Point(this.x + other.x, this.y + other.y);
  }
  sub(other: Point): Point {
    return new Point(this.x - other.x, this.y - other.y);
  }
  mult(other: number): Point {
    return new Point(this.x * other, this.y * other);
  }
  _add(other: Point): void {
    this.x += other.x;
    this.y += other.y;
  }
  _compare(): ((other: Point) => boolean) {
    return (other: Point) => { return this.x === other.x && this.y === other.y; };
  }
  copy(): Point {
    return new Point(this.x, this.y);
  }
}

class Board {
  width: number;
  height: number;
  size: number;
  constructor(w, h, s) {
    this.width = w;
    this.height = h;
    this.size = s;
  }
  inBounds(i: number, j: number): boolean {
    return i < 0 || i >= this.width || j < 0 || j >= this.height;
  }
  centerOf(i: number, j: number, corner: Point): Point | null {
    if ((i < 0 || i >= this.width) || (j < 0 || j >= this.height)) {
      return null;
    }
    return corner.add(new Point(i * this.size + this.size / 2, j * this.size + this.size / 2));
  }
  draw(corner: Point) {
    for (var i = 0; i < this.width + 1; i++) {
      drawLine(corner.add(new Point(i * this.size, 0)), corner.add(new Point(i * this.size, this.size * this.height)), "black");
    }
    for (var j = 0; j < this.height + 1; j++) {
      drawLine(corner.add(new Point(0, j * this.size)), corner.add(new Point(this.size * this.width, j * this.size)), "black");
    }
  }
}



let b = new Board(10, 10, 50);
let corner = new Point(250, 50);
var player = new Point(2, 2);
let playerPos: Array<Point> = [];
playerPos.push(player.copy());
let walls: Array<Point> = [];
walls.push(new Point(3, 3));
walls.push(new Point(1, 1));

let holes: Array<Point> = [];
holes.push(new Point(4, 4));
holes.push(new Point(6, 6));
let crates: Array<Point> = [];
crates.push(new Point(5, 5));



function draw() {
  clearAll();
  b.draw(corner);
  for (var w of walls) {
    drawSquare(b.centerOf(w.x, w.y, corner), 50, "black");
  }
  for (var h of holes) {
    drawSquare(b.centerOf(h.x, h.y, corner), 45, "grey");
  }
  for (var c of crates) {
    drawSquare(b.centerOf(c.x, c.y, corner), 40, "brown");
  }
  let pp = b.centerOf(player.x, player.y, corner);
  if (pp === null) {
    player = playerPos.pop();
    pp = b.centerOf(player.x, player.y, corner);
  }
  if (walls.some(player._compare())) {
    player = playerPos.pop();
    pp = b.centerOf(player.x, player.y, corner);
  }
  if (holes.some(player._compare())) {
    player = playerPos.pop();
    pp = b.centerOf(player.x, player.y, corner);
  }
  drawCircle(pp, 20, "green");
  let prev = playerPos.slice(-1)[0];
  if (prev.x != player.x || prev.y != player.y) {
    playerPos.push(player.copy());
  }
  requestAnimationFrame(draw);
}

function keyDownHandler(event: KeyboardEvent) {
}
function keyUpHandler(event: KeyboardEvent) {
  if (event.key === "ArrowUp") {
    player.y -= 1;
  }
  if (event.key === "ArrowDown") {
    player.y += 1;
  }
  if (event.key === "ArrowLeft") {
    player.x -= 1;
  }
  if (event.key === "ArrowRight") {
    player.x += 1;
  }
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

requestAnimationFrame(draw);
