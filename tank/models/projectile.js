import { canvas, ctx, PP } from "../config.js";

export default class Projectile {
  constructor(data) {
    this.dmg = data.dmg;
    this.x = data.x;
    this.y = data.y;
    this.r = data.r;
    this.angle = data.angle;
    this.duration = data.duration;
    this.speed = data.speed;
    this.color = data.color || "#000";
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(PP(this.x), PP(this.y), PP(this.r), 0, Math.PI * 2);
    ctx.fill();
  }

  static fromJSON(data) {
    return new Projectile(data);
  }
}
