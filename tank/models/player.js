import { ctx, PP } from "../config.js";
import Weapon from "./weapon.js";

export default class Player {
  static size = 0.3;

  constructor(data) {
    this.id = data.id;
    this.x = data.x;
    this.y = data.y;
    this.angle = data.angle;
    this.color = data.color;
    this.hp = data.hp;
    this.weapon = data.weapon;
    this.isAlive = data.isAlive;
    this.deathPieces = data.deathPieces || [];
  }

  draw() {
    if (!this.isAlive) {
      this.deathPieces.forEach((p) => {
        ctx.fillStyle = this.color;
        ctx.save();
        ctx.translate(PP(p.x), PP(p.y));
        ctx.rotate(p.rotation);
        ctx.beginPath();
        ctx.moveTo(0, -PP(Player.size / 5));
        ctx.lineTo(PP(Player.size / 5), PP(Player.size / 5));
        ctx.lineTo(-PP(Player.size / 5), PP(Player.size / 5));
        ctx.closePath();
        ctx.globalAlpha = p.duration / (p.duration + 1);
        ctx.fill();

        ctx.restore();
      });
      return;
    }

    ctx.fillStyle = this.color;
    ctx.save();
    ctx.translate(PP(this.x), PP(this.y));
    ctx.rotate(this.angle);
    ctx.fillRect(-PP(Player.size / 2), -PP(Player.size / 2), PP(Player.size), PP(Player.size));
    Weapon.draw(this.weapon);
    ctx.restore();

    ctx.font = "12px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    ctx.save();
    ctx.translate(PP(this.x), PP(this.y));
    ctx.fillText(this.id, 0, -PP(Player.size / 2) - 25);
    ctx.globalAlpha = 0.5;
    ctx.fillText(`(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`, 0, -PP(Player.size / 2) - 10);
    ctx.restore();
  }

  static fromJSON(data) {
    return new Player(data);
  }
}
