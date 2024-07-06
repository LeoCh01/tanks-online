import Projectile from "./projectile.js";
import Game from "./game.js";

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
      x: x + Math.cos(angle),
      y: y + Math.sin(angle),
      r: 0.08,
      angle: angle,
      duration: 2,
      speed: 10,
    });

    return projectile;
  }

  static shootType2(x, y, angle) {
    const projectile = new Projectile({
      dmg: 10,
      x: x + Math.cos(angle),
      y: y + Math.sin(angle),
      r: 0.1,
      angle: angle,
      duration: 1,
      speed: 20,
    });

    return projectile;
  }

  static shootType3(x, y, angle) {
    const projectile = new Projectile({
      dmg: 40,
      x: x + Math.cos(angle),
      y: y + Math.sin(angle),
      r: 0.08,
      angle: angle,
      duration: 2,
      speed: 10,
    });

    return projectile;
  }
}
