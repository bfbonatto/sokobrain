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
  _add(other: Point): void {
    this.x += other.x;
    this.y += other.y;
  }
}

type Position = Point;

type Board = [number, number];

enum Direction {
  Up,
  Down,
  Left,
  Right,
}

function toPos(d: Direction): Position {
  switch (d) {
    case Direction.Up: return new Point(0, -1);
    case Direction.Down: return new Point(0, 1);
    case Direction.Left: return new Point(-1, 0);
    case Direction.Right: return new Point(1, 0);
  }
}

class RenderComponent {
  render: (pos: Position) => any;
}

class ControllerComponent {
  direction: Direction | null;
}

class GridComponent {
  position: Position;
}

class Entity {
  index: number;
  generation: number;
  constructor(i: number, g: number) {
    this.index = i;
    this.generation = g;
  }
}

class Item<K, V> {
  key: K;
  value: V;
  constructor(k: K, v: V) {
    this.key = k;
    this.value = v;
  }
}

class EntityMap<T> {
  entries: Item<Entity, T>[];
  constructor() {
    this.entries = [];
  }
  add(index: Entity, value: T) {
    for (var e of this.entries) {
      if (e.key.index === index.index && e.key.generation <= index.generation) {
        e.value = value;
        e.key = index;
        return;
      }
    }
    this.entries.push(new Item(index, value));
  }
  get(index: Entity): T | null {
    for (var e of this.entries) {
      if (e.key.index === index.index && e.key.generation === index.generation) {
        return e.value;
      }
    }
    return null;
  }
  *[Symbol.iterator]() {
    for (var i of this.entries) {
      yield i;
    }
  }
}

class Allocator {
  index: number;
  generation: number;
  constructor() {
    this.index = 0;
    this.generation = 0;
  }
  newIndex(): Entity {
    this.index += 1;
    return new Entity(this.index - 1, this.generation);
  }
  newGeneration() {
    this.index = 0;
    this.generation += 1;
  }
}

class GameState {
  player: Entity;
  render_components: EntityMap<RenderComponent>;
  controller_components: EntityMap<ControllerComponent>;
  grid_components: EntityMap<GridComponent>;
  board: Board;
  allocator: Allocator;
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
