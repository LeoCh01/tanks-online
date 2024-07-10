import Player from "./player.js";
import { closestPointOnSegment, getNormal, isCircLineCollision, isCircRectCollision } from "../utils/utils.js";
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
    Game.projectiles.forEach((p) => {
      for (const player of Game.players.values()) {
        if (!player.isAlive) {
          continue;
        }
        if (isCircRectCollision(p.x, p.y, p.r, player.getRect())) {
          player.takingDamage(p.dmg);
          Game.projectiles.splice(Game.projectiles.indexOf(p), 1);
        }
      }

      for (const wall of this.gameMap.walls) {
        for (let i = 0; i < 4; i++) {
          let w1 = GameMap.toRect(wall)[i];
          let w2 = GameMap.toRect(wall)[(i + 1) % 4];

          if (isCircLineCollision(p.x, p.y, p.r, w1, w2)) {
            let closest = closestPointOnSegment(p.x, p.y, w1.x, w1.y, w2.x, w2.y);
            let distance = Math.hypot(p.x - closest.x, p.y - closest.y);
            let penetration = p.r - distance;
            let normal = getNormal(w1, w2);

            p.x += normal.x * penetration;
            p.y += normal.y * penetration;
            p.reflect(normal);
          }
        }
      }
    });
  }
}
