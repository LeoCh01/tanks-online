import Player from "./player.js";
import { isCircRectCollision } from "../utils/utils.js";
import GameMap from "./gameMap.js";

export default class Game {
  static players = new Map();
  static projectiles = [];

  constructor(io) {
    this.lastTime = 0;
    this.io = io;
    this.gameMap = new GameMap();
  }

  emitAll() {
    this.io.emit("gameState", {
      players: Array.from(Game.players.values()).map((player) => player.toJSON()),
      projectiles: Game.projectiles.map((p) => p.toJSON()),
    });
  }

  emitMap() {
    this.io.emit("gameMap", this.gameMap.toJSON());
  }

  start() {
    this.gameMap.generate();
    this.emitMap();

    Game.players.forEach((player) => {
      [player.x, player.y, player.angle] = this.gameMap.getRandomPosition();
    });

    this.lastTime = Date.now();
    this.intervalID = setInterval(this.gameLoop.bind(this), 1000 / 120);
  }

  stop() {
    clearInterval(this.intervalID);
    this.lastTime = 0;
    Game.projectiles = [];
  }

  gameLoop() {
    let now = Date.now();
    let dt = (now - this.lastTime) / 1000;
    this.lastTime = now;

    this.update(dt);
    this.emitAll();
  }

  update(dt) {
    // Update players
    for (const player of Game.players.values()) {
      player.update(dt);
    }

    // Update projectiles
    Game.projectiles.forEach((p) => {
      if (!p.update(dt)) {
        Game.projectiles.splice(Game.projectiles.indexOf(p), 1);
      }
    });

    // Check for collisions
    for (const player of Game.players.values()) {
      if (!player.isAlive) {
        continue;
      }
      Game.projectiles.forEach((p) => {
        if (isCircRectCollision(p.x, p.y, p.r, player.getRect())) {
          player.takingDamage(p.dmg);
          Game.projectiles.splice(Game.projectiles.indexOf(p), 1);
        }
      });
    }
  }
}
