export default class GameMap {
  constructor() {
    this.width = 0;
    this.height = 0;
    this.walls = [];
  }

  generate() {
    this.width = 8;
    this.height = 8;
    this.walls = [
      { x1: 0, y1: 1, x2: 1, y2: 1 },
      { x1: 3, y1: 3, x2: 4, y2: 3 },
      { x1: 6, y1: 6, x2: 6, y2: 7 },
      { x1: 2, y1: 2, x2: 2, y2: 5 },
      { x1: 4, y1: 1, x2: 4, y2: 2 },
      { x1: 5, y1: 4, x2: 7, y2: 4 },
      { x1: 1, y1: 5, x2: 3, y2: 5 },
      { x1: 7, y1: 2, x2: 7, y2: 3 },
    ];

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

  toJSON() {
    return {
      width: this.width,
      height: this.height,
      walls: this.walls,
    };
  }
}
