import Projectile from "./projectile.js";
import Game from "./game.js";

export default class Weapon {
  constructor() {}

  shoot(x, y, angle) {
    const projectile = new Projectile({
      dmg: 50,
      x: x + Math.cos(angle),
      y: y + Math.sin(angle),
      r: 0.08,
      angle: angle,
      duration: 2,
      speed: 10,
    });

    Game.projectiles.push(projectile);
  }
}
