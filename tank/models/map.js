import { canvas, ctx, PP } from "../config.js";

export default class Map {
  constructor(data) {
    this.walls = data.walls;
    this.length = data.length;
    this.width = data.width;
  }

  draw() {}

  static fromJSON(data) {
    return new Map(data);
  }
}
