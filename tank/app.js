import { canvas, ctx, PP } from "./config.js";
import Player from "./models/player.js";
import UI from "./models/ui.js";
import Client from "./utils/client.js";

export default class App {
  constructor() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.lastTime = 0;
  }

  async start() {
    Client.connect();
    this.addEventListeners();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    this.ui = new UI();

    this.gameLoop();
  }

  stop() {
    Client.socket.disconnect();
    cancelAnimationFrame(this.animationID);
  }

  gameLoop() {
    this.draw();
    this.animationID = requestAnimationFrame(this.gameLoop.bind(this));
  }

  draw() {
    ctx.fillStyle = "#80af49";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    this.drawProjectiles();
    this.drawPlayers();
    this.ui.draw();
  }

  drawPlayers() {
    Client.players.forEach((player) => {
      player.draw();
    });
  }

  drawProjectiles() {
    Client.projectiles.forEach((p) => {
      p.draw();
    });
  }

  addEventListeners() {
    window.addEventListener("keydown", (e) => {
      if (e.repeat) return;
      Client.syncEvent("keydown", e.key);
    });
    window.addEventListener("keyup", (e) => {
      Client.syncEvent("keyup", e.key);
    });
  }
}
