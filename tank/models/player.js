import { ctx, PP } from "../config.js";
import Weapon from "./weapon.js";
import Client from "../utils/client.js";

export default class Player {
  static size = 0.3;
  static emote = new Image();

  constructor(data) {
    this.id = data.id;
    this.x = data.x;
    this.y = data.y;
    this.angle = data.angle;
    this.color = Client.id === this.id ? "#ffd670" : "#98c1d9";
    this.hp = data.hp;
    this.weapon = data.weapon;
    this.isAlive = data.isAlive;
    this.deathPieces = data.deathPieces || [];
    this.score = data.score;

    this.isEmote = data.isEmote;
    this.emoteCount = data.emoteCount;
    this.emotePos = data.emotePos;

    Player.emote.src = "./res/emote.gif";
    if (this.emoteCount === 99) {
      if (this.emoteAudio) {
        this.emoteAudio.pause();
      }
      this.emoteAudio = new Audio("./res/emote.mp3");
      this.emoteAudio.play();
    }
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

    if (this.isEmote) {
      const emoteSize = PP(0.05);
      const emoteScale = Math.sin(Date.now() / 100) + PP(0.1);
      const emoteX = (-emoteSize / 2) * emoteScale + PP(this.emotePos[0]);
      const emoteY = (-emoteSize / 2) * emoteScale + PP(this.emotePos[1]);
      const emoteWidth = emoteSize * emoteScale;
      const emoteHeight = emoteSize * emoteScale;

      ctx.drawImage(Player.emote, emoteX, emoteY, emoteWidth, emoteHeight);
    }

    ctx.fillStyle = this.color;
    ctx.font = "12px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    ctx.save();
    ctx.translate(PP(this.x), PP(this.y));

    // ctx.fillText(this.id, 0, -PP(Player.size / 2) - 25);
    ctx.fillText(this.score, 0, -PP(Player.size / 2) - 25);
    ctx.globalAlpha = 0.5;
    ctx.fillText(`(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`, 0, -PP(Player.size / 2) - 10);
    ctx.restore();

    ctx.fillStyle = this.color;
    ctx.globalAlpha = 1;
    ctx.save();
    ctx.translate(PP(this.x), PP(this.y));
    ctx.rotate(this.angle);
    ctx.fillRect(-PP(Player.size / 2), -PP(Player.size / 2), PP(Player.size), PP(Player.size));
    Weapon.draw(this.weapon);
    ctx.restore();
  }

  static fromJSON(data) {
    return new Player(data);
  }
}
