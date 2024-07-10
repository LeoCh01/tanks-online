import Projectile from "./projectile.js";
import Game from "./game.js";
import { SIZE } from "../config.js";
import Player from "./player.js";

export default class Weapon {
  constructor() {}

  static shoot(type, x, y, angle) {
    let projectile;
    switch (type) {
      case 1:
        projectile = this.shootType1(x, y, angle);
        break;
      case 2:
        projectile = this.shootType2(x, y, angle);
        break;
      case 3:
        projectile = this.shootType3(x, y, angle);
        break;
    }

    Game.projectiles.push(projectile);
  }

  static shootType1(x, y, angle) {
    const projectile = new Projectile({
      dmg: 30,
      x: x + Math.cos(angle) * Player.size,
      y: y + Math.sin(angle) * Player.size,
      r: 0.1 * Player.size,
      angle: angle,
      duration: 10,
      speed: 2.5,
    });

    return projectile;
  }

  static shootType2(x, y, angle) {}

  static shootType3(x, y, angle) {}
}
