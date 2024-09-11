import Projectile from "./projectile.js";
import Game from "./game.js";
import { SIZE } from "../config.js";
import Player from "./player.js";

export default class Weapon {
  constructor(type, ammo, duration, shootType) {
    this.type = type;
    this.ammo = ammo;
    this.duration = duration;
    this.shootType = shootType;
  }

  shoot(x, y, angle) {
    if (this.ammo <= 0) return;

    Game.projectiles.push(this.shootType(x, y, angle));
    this.ammo--;

    setTimeout(() => {
      this.ammo++;
    }, this.duration * 1000);
  }

  shootType1(x, y, angle) {
    return new Projectile({
      dmg: 30,
      x: x + Math.cos(angle) * Player.size * (0.8 + 0.1),
      y: y + Math.sin(angle) * Player.size * (0.8 + 0.1),
      r: 0.1 * Player.size,
      angle: angle,
      duration: this.duration,
      speed: 2.5,
    });
  }

  shootType2(x, y, angle) {
    return new Projectile({
      dmg: 80,
      x: x + Math.cos(angle) * Player.size * (0.8 + 0.5),
      y: y + Math.sin(angle) * Player.size * (0.8 + 0.5),
      r: 0.5 * Player.size,
      angle: angle,
      duration: this.duration,
      speed: 5,
    });
  }

  shootType3(x, y, angle) {
    return new Projectile({
      dmg: 100,
      x: x + Math.cos(angle) * Player.size * (0.8 + 3),
      y: y + Math.sin(angle) * Player.size * (0.8 + 3),
      r: 3 * Player.size,
      angle: angle,
      duration: this.duration,
      speed: 1.5,
      color: "#ff0000",
      isPen: true,
    });
  }

  static getWeapon(type) {
    switch (type) {
      case 1:
        return new Weapon(1, 5, 7, Weapon.prototype.shootType1);
      case 2:
        return new Weapon(2, 3, 3, Weapon.prototype.shootType2);
      case 3:
        return new Weapon(3, 100, 15, Weapon.prototype.shootType3);
    }
  }
}
