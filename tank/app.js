import { canvas, ctx, PP } from "./config.js";
import Player from "./models/player.js";
import UI from "./utils/ui.js";
import Client from "./utils/client.js";

export default class App {
  constructor() {
    this.lastTime = 0;
  }

  async start() {
    Client.connect();

    await new Promise((resolve) => {
      const checkClientId = () => {
        if (Client.id !== undefined) {
          resolve();
        } else {
          setTimeout(checkClientId, 100);
        }
      };
      checkClientId();
    });

    this.addEventListeners();
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

    const centerX = canvas.width / 2 - PP(Client.gameMap.width / 2);
    const centerY = canvas.height / 2 - PP(Client.gameMap.height / 2);
    ctx.save();
    ctx.translate(centerX, centerY);
    this.drawGameMap();
    this.drawPlayers();
    this.drawProjectiles();
    ctx.restore();

    this.drawScoreBoard();
    this.ui.draw();
  }

  drawPlayers() {
    Object.values(Client.players).forEach((p) => {
      p.draw();
    });
  }

  drawProjectiles() {
    Client.projectiles.forEach((p) => {
      p.draw();
    });
  }

  drawScoreBoard() {
    const sortedPlayers = Object.values(Client.players).sort((a, b) => b.score - a.score);

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(10, 10, 200, 200);

    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Scoreboard", 20, 30);

    sortedPlayers.forEach((p, i) => {
      ctx.fillText(`${i + 1}. ${p.id.substring(0, 4)} - ${p.score}`, 20, 50 + i * 20);
    });
  }

  drawGameMap() {
    Client.gameMap.draw();
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
