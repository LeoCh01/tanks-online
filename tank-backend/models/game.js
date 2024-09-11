import Player from "./player.js";
import {
  closestPointOnSegment,
  getNormal,
  isCircLineCollision,
  isCircRectCollision,
  isRectRectCollision,
} from "../utils/utils.js";
import GameMap from "./gameMap.js";

export default class Game {
  static players = new Map();
  static projectiles = [];

  constructor(io) {
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

  async createNewPlayer(uid) {
    Game.players.set(uid, new Player({ id: uid }));
    this.emitAll();
    this.emitMap();

    if (Game.players.size === 1) {
      this.start();
    } else if (Game.players.size === 2) {
      this.stop();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      this.start();
    } else {
    }
  }

  async start() {
    await this.gameMap.generate();
    this.emitMap();

    Game.players.forEach((player) => {
      player.reset(this.gameMap.getRandomPosition());
    });

    console.log("Game started");

    Game.projectiles = [];
    this.lastTime = Date.now();
    this.isGameFinished = false;
    this.intervalID = setInterval(this.gameLoop.bind(this), 1000 / 120);
  }

  stop() {
    clearInterval(this.intervalID);
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

      if (!p.isPen) {
        for (const wall of this.gameMap.walls) {
          for (let i = 0; i < 4; i++) {
            let w1 = GameMap.toRect(wall)[i];
            let w2 = GameMap.toRect(wall)[(i + 1) % 4];

            if (isCircLineCollision(p.x, p.y, p.r, w1, w2)) {
              let closest = closestPointOnSegment(p.x, p.y, w1.x, w1.y, w2.x, w2.y);
              let distance = Math.hypot(p.x - closest.x, p.y - closest.y);
              let penetration = p.r - distance;
              let normal = getNormal(w1, w2);

              p.x += normal.x * penetration * 1.5;
              p.y += normal.y * penetration * 1.5;
              p.reflect(normal);
            }
          }
        }
      }
    });

    for (const player of Game.players.values()) {
      if (!player.isAlive) {
        continue;
      }
      for (const wall of this.gameMap.walls) {
        const mtv = isRectRectCollision(player.getRect(), GameMap.toRect(wall));
        if (mtv) {
          player.x += mtv.x * 5;
          player.y += mtv.y * 5;
        }
      }
    }

    // On game end
    if (
      !this.isGameFinished &&
      ((this.alivePlayersCount() <= 1 && Game.players.size > 1) ||
        (this.alivePlayersCount() === 0 && Game.players.size === 1))
    ) {
      this.isGameFinished = true;
      new Promise((resolve) => setTimeout(resolve, 1500)).then(() => {
        this.stop();
        for (const player of Game.players.values()) {
          if (player.isAlive) {
            player.score++;
          }
        }
        new Promise((resolve) => setTimeout(resolve, 750)).then(() => {
          this.start();
        });
      });
    }
  }

  alivePlayersCount() {
    let count = 0;
    for (const player of Game.players.values()) {
      if (player.isAlive) {
        count++;
      }
    }
    return count;
  }
}
