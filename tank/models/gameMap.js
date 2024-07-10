import { canvas, ctx, PP } from "../config.js";

export default class GameMap {
  static wallThickness = 0.1;

  constructor(data) {
    this.walls = data.walls;
    this.height = data.height;
    this.width = data.width;
  }

  draw() {
    ctx.fillStyle = "#000000";

    this.walls.forEach((wall) => {
      GameMap.drawWall(wall, GameMap.wallThickness);
    });
  }

  static drawWall(wall, thickness) {
    let x1 = PP(wall.x1);
    let y1 = PP(wall.y1);
    let x2 = PP(wall.x2);
    let y2 = PP(wall.y2);
    let t = PP(thickness);

    let x = Math.min(x1, x2) - t / 2;
    let y = Math.min(y1, y2) - t / 2;
    let width = Math.abs(x2 - x1) + t;
    let height = Math.abs(y2 - y1) + t;
    ctx.fillRect(x, y, width, height);
  }

  static fromJSON(data) {
    return new GameMap(data);
  }
}
