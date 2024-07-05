export default class Projectile {
  constructor(data) {
    this.dmg = data.dmg;
    this.x = data.x;
    this.y = data.y;
    this.r = data.r;
    this.angle = data.angle;
    this.duration = data.duration;
    this.speed = data.speed;
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

  toJSON() {
    return {
      dmg: this.dmg,
      x: this.x,
      y: this.y,
      r: this.r,
      angle: this.angle,
      duration: this.duration,
      speed: this.speed,
    };
  }
}
