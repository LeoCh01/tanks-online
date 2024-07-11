import fs from "fs";

export default class GameMap {
  static wallThickness = 0.1;
  static data = JSON.parse(fs.readFileSync("./maps.json", "utf8"));

  constructor() {
    this.width = 0;
    this.height = 0;
    this.walls = [];
  }

  async generate() {
    const mapIndex = Math.floor(Math.random() * 3 + 1);
    this.width = GameMap.data[mapIndex].width;
    this.height = GameMap.data[mapIndex].height;
    this.walls = GameMap.data[mapIndex].walls;

    this.walls.push({ x1: 0, y1: 0, x2: this.width, y2: 0 });
    this.walls.push({ x1: 0, y1: 0, x2: 0, y2: this.height });
    this.walls.push({ x1: this.width, y1: 0, x2: this.width, y2: this.height });
    this.walls.push({ x1: 0, y1: this.height, x2: this.width, y2: this.height });
  }

  getRandomPosition() {
    let x = Math.floor(Math.random() * this.width) + 0.5;
    let y = Math.floor(Math.random() * this.height) + 0.5;
    let angle = Math.floor(Math.random() * 2 * Math.PI);
    return [x, y, angle];
  }

  static toRect(wall) {
    return [
      { x: wall.x1 - GameMap.wallThickness / 2, y: wall.y1 - GameMap.wallThickness / 2 },
      { x: wall.x1 - GameMap.wallThickness / 2, y: wall.y2 + GameMap.wallThickness / 2 },
      { x: wall.x2 + GameMap.wallThickness / 2, y: wall.y2 + GameMap.wallThickness / 2 },
      { x: wall.x2 + GameMap.wallThickness / 2, y: wall.y1 - GameMap.wallThickness / 2 },
    ];
  }

  toJSON() {
    return {
      width: this.width,
      height: this.height,
      walls: this.walls,
    };
  }
}
