import { ctx, PP } from "../config.js";
import Weapon from "./weapon.js";
import Client from "../utils/client.js";
import EmoteManager from "../utils/emoteManager.js";

export default class Player {
  static size = 0.3;

  constructor(data) {
    this.id = data.id;
    this.color = Client.id === this.id ? "#ffd670" : "#98c1d9";
    this.emoteManager = new EmoteManager();
    this.update(data);
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

    this.emoteManager.draw();

    ctx.save();
    ctx.translate(PP(this.x), PP(this.y));
    ctx.fillStyle = this.color;
    ctx.font = "12px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    ctx.fillStyle = "#545454";
    ctx.fillRect(-PP(Player.size / 2), -PP(Player.size / 2) - 20, PP(Player.size), 5);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.strokeRect(-PP(Player.size / 2), -PP(Player.size / 2) - 20, PP(Player.size), 5);
    ctx.fillStyle = "red";
    ctx.fillRect(-PP(Player.size / 2), -PP(Player.size / 2) - 20, (PP(Player.size) * this.hp) / 100, 5);

    ctx.fillText(this.id.substring(0, 4), 0, -PP(Player.size / 2) - 25);
    // ctx.globalAlpha = 0.5;
    // ctx.fillText(`(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`, 0, -PP(Player.size / 2) - 10);

    ctx.restore();

    ctx.fillStyle = this.color;
    ctx.globalAlpha = 1;
    ctx.save();
    ctx.translate(PP(this.x), PP(this.y));
    ctx.rotate(this.angle);
    ctx.fillRect(-PP(Player.size / 2), -PP(Player.size / 2), PP(Player.size), PP(Player.size));
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeRect(-PP(Player.size / 2), -PP(Player.size / 2), PP(Player.size), PP(Player.size));
    Weapon.draw(this.weapon);
    ctx.restore();
  }

  static fromJSON(data) {
    return new Player(data);
  }

  update(data) {
    this.x = data.x;
    this.y = data.y;
    this.angle = data.angle;
    this.hp = data.hp;
    this.weapon = data.weapon;
    this.isAlive = data.isAlive;
    this.deathPieces = data.deathPieces || [];
    this.score = data.score;

    this.emoteManager.update(data.emotes);
  }
}
