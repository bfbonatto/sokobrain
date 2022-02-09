const canvas = <HTMLCanvasElement>document.getElementById("canvas");
let ctx: CanvasRenderingContext2D;
let ctc = canvas.getContext("2d")
if (ctc != null) {
  ctx = ctc;
}

function clearAll() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawSquare(center: Point, length: number, color: string) {
  ctx.beginPath();
  ctx.rect(center.x - length / 2, center.y - length / 2, length, length);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function drawCircle(center: Point, radius: number, color: string) {
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function drawLine(p1: Point, p2: Point, color: string) {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.closePath();
  ctx.stroke();
}

class Point {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  add(other: Point): Point {
    return new Point(this.x + other.x, this.y + other.y);
  }
  sub(other: Point): Point {
    return new Point(this.x - other.x, this.y - other.y);
  }
  scale(other: number): Point {
    return new Point(this.x * other, this.y * other);
  }
  normalize(): Point {
    let norm = Math.sqrt((this.x * this.x) + (this.y * this.y));
    return new Point(this.x / norm, this.y / norm);
  }
  _compare(): ((other: Point) => boolean) {
    return (other: Point) => { return this.x === other.x && this.y === other.y; };
  }
  _diff(): ((other: Point) => boolean) {
    return (other: Point) => { return this.x != other.x || this.y != other.y; };
  }
  copy(): Point {
    return new Point(this.x, this.y);
  }
}

class Board {
  width: number;
  height: number;
  size: number;
  constructor(w: number, h: number, s: number) {
    this.width = w;
    this.height = h;
    this.size = s;
  }
  inBounds(i: number, j: number): boolean {
    return !(i < 0 || i >= this.width || j < 0 || j >= this.height);
  }
  centerOf(i: number, j: number, corner: Point): Point {
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

enum Direction {
  Up,
  Down,
  Left,
  Right,
}

function toPoint(d: Direction): Point {
  switch (d) {
    case Direction.Up:
      return new Point(0, -1);
    case Direction.Down:
      return new Point(0, 1);
    case Direction.Left:
      return new Point(-1, 0);
    case Direction.Right:
      return new Point(1, 0);
  }
}

enum GameType {
  Player,
  Wall,
  Hole,
  Crate,
}

class GameState {
  player: Point;
  walls: Array<Point>;
  crates: Array<Point>;
  holes: Array<Point>;
  board: Board;

  constructor(p: Point, ws: Array<Point>, cs: Array<Point>, hs: Array<Point>, b: Board) {
    this.player = p;
    this.walls = ws;
    this.crates = cs;
    this.holes = hs;
    this.board = b;
  }

  move(d: Direction): void {
    let delta = toPoint(d);
    let newPos = this.player.add(delta);
    if (!this.board.inBounds(newPos.x, newPos.y)) {
      return;
    }
    let there = this.get(newPos);
    if (there.includes(GameType.Wall)) {
      return;
    }
    if (there.includes(GameType.Hole) && !there.includes(GameType.Crate)) {
      return;
    }
    if (there.includes(GameType.Crate) && !there.includes(GameType.Hole)) {
      let after = newPos.add(delta);
      if (!this.board.inBounds(after.x, after.y)) {
        return;
      }
      let thereAfter = this.get(after);
      if (thereAfter.includes(GameType.Wall) || thereAfter.includes(GameType.Crate)) {
        return;
      }
      this.crates = this.crates.filter(newPos._diff());
      this.crates.push(after);
    }
    this.player = newPos;
  }

  get(p: Point): Array<GameType> {
    let t = [];
    if (this.walls.some(p._compare())) {
      t.push(GameType.Wall);
    }
    if (this.crates.some(p._compare())) {
      t.push(GameType.Crate);
    }
    if (this.holes.some(p._compare())) {
      t.push(GameType.Hole);
    }
    if (p._compare()(this.player)) {
      t.push(GameType.Player);
    }
    return t;
  }

  draw(corner: Point): void {
    this.board.draw(corner);
    let position = ((p: Point) => this.board.centerOf(p.x, p.y, corner));
    for (var w of this.walls) {
      drawSquare(position(w), this.board.size - 3, "black");
    }
    for (var h of this.holes) {
      drawSquare(position(h), this.board.size * 3 / 4, "grey");
    }
    for (var c of this.crates) {
      drawSquare(position(c), this.board.size * 2 / 3, "brown");
    }
    drawCircle(position(this.player), this.board.size / 4, "green");
  }
  win(): boolean {
    let pos = this.crates.map(p => this.get(p));
    return pos.every(arr => arr.includes(GameType.Hole));
  }

}

function draw(game: GameState) {
  clearAll();
  game.draw(new Point(150, 100));
}

function parse(state: String, size: number): GameState {
  let lines = state.split('\n');
  let height = lines.length;
  let width = lines[0].length;
  let board = new Board(width, height, size);
  let walls: Array<Point> = [];
  let holes: Array<Point> = [];
  let crates: Array<Point> = [];
  var player: Point = new Point(-1, -1);
  for (var j = 0; j < height; j++) {
    for (var i = 0; i < width; i++) {
      let p = new Point(i, j);
      switch (lines[j][i]) {
        case 'p':
          player = p;
          break;
        case 'w':
          walls.push(p);
          break;
        case 'h':
          holes.push(p);
          break;
        case 'c':
          crates.push(p);
          break;
      }
    }
  }
  return new GameState(player, walls, crates, holes, board);
}

function keyUpHandler(game: GameState, event: KeyboardEvent) {
  switch (event.key) {
    case "ArrowUp":
      game.move(Direction.Up);
      requestAnimationFrame(() => draw(game));
      break;
    case "ArrowDown":
      game.move(Direction.Down);
      requestAnimationFrame(() => draw(game));
      break;
    case "ArrowLeft":
      game.move(Direction.Left);
      requestAnimationFrame(() => draw(game));
      break;
    case "ArrowRight":
      game.move(Direction.Right);
      requestAnimationFrame(() => draw(game));
      break;
  }
}

function handlerMaker(game: GameState, callback: ((game: GameState, event: KeyboardEvent) => void)): ((event: KeyboardEvent) => void) {
  return (e => callback(game, e));
}
