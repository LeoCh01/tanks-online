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
    this.isPen = data.isPen || false;
  }

  update(dt) {
    this.x += Math.cos(this.angle) * this.speed * dt;
    this.y += Math.sin(this.angle) * this.speed * dt;
    this.duration -= dt;

    if (this.duration <= 0) {
      return false;
    }

    return true;
  }

  reflect(normal) {
    let vx = Math.cos(this.angle) * this.speed;
    let vy = Math.sin(this.angle) * this.speed;
    let dot = vx * normal.x + vy * normal.y;
    let nx = normal.x * dot;
    let ny = normal.y * dot;
    let rx = vx - 2 * nx;
    let ry = vy - 2 * ny;
    this.angle = Math.atan2(ry, rx);
  }

  toJSON() {
    return {
      dmg: this.dmg,
      x: this.x,
      y: this.y,
      r: this.r,
      angle: this.angle,
      duration: this.duration,
      speed: this.speed,
      color: this.color,
    };
  }
}
