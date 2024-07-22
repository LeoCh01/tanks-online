import { canvas, ctx, PP } from "../config.js";
import Client from "./client.js";

export default class UI {
  constructor() {}

  draw() {
    this.player = Client.players[Client.id];

    this.healthBar();
    // this.miniMap();
    this.playerCoords();
  }

  lerpColor(color1, color2, t) {
    const r = Math.round(color1[0] + (color2[0] - color1[0]) * t);
    const g = Math.round(color1[1] + (color2[1] - color1[1]) * t);
    const b = Math.round(color1[2] + (color2[2] - color1[2]) * t);
    return `rgb(${r}, ${g}, ${b})`;
  }

  getHealthColor(hp) {
    if (hp > 60) {
      return "#b9b9b9"; // Light grey
    } else if (hp > 30) {
      const t = (hp - 30) / 30;
      return this.lerpColor([82, 82, 82], [185, 185, 185], t);
    } else {
      const t = hp / 30;
      return this.lerpColor([255, 0, 0], [82, 82, 82], t);
    }
  }

  healthBar() {
    const barW = window.innerWidth / 2;
    const barH = 40;
    const hpW = (barW * Math.max(2, this.player.hp)) / 100 - 4;

    ctx.fillStyle = this.getHealthColor(this.player.hp);
    if (this.player.hp > 0) {
      ctx.roundRect((canvas.width - barW) / 2 + 2, canvas.height - barH - 20, hpW, barH, 10);
      ctx.fill();
    }

    ctx.strokeStyle = "#545454";
    ctx.lineWidth = 4;
    ctx.roundRect((canvas.width - barW) / 2, canvas.height - barH - 20, barW, barH, 10);
    ctx.stroke();
  }

  miniMap() {
    ctx.fillStyle = "#b9b9b9";
    ctx.fillRect(20, 20, 200, 200);
  }

  playerCoords() {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`X: ${this.player.x.toFixed(2)}`, 30, 250);
    ctx.fillText(`Y: ${this.player.y.toFixed(2)}`, 30, 280);
  }
}

CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
  this.beginPath();
  this.moveTo(x + radius, y);
  this.lineTo(x + width - radius, y);
  this.quadraticCurveTo(x + width, y, x + width, y + radius);
  this.lineTo(x + width, y + height - radius);
  this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  this.lineTo(x + radius, y + height);
  this.quadraticCurveTo(x, y + height, x, y + height - radius);
  this.lineTo(x, y + radius);
  this.quadraticCurveTo(x, y, x + radius, y);
  this.closePath();
};
