import Weapon from "./weapon.js";
import { Key } from "../utils/events.js";
import { SIZE } from "../config.js";

export default class Player {
  static speed = 2;
  static size = 0.3;
  static colors = ["#ffd670", "#98c1d9", "#f3a712", "#2a363b"];

  constructor(data) {
    this.id = data.id;
    this.color = data.color;
    this.reset([0, 0, 0]);

    this.event = new Key();
  }

  update(dt) {
    if (!this.isAlive) {
      this.deathPieces.forEach((p) => {
        p.x += Math.cos(p.angle) * p.speed * dt;
        p.y += Math.sin(p.angle) * p.speed * dt;
        p.rotation += 3 * p.speed * dt;
        p.duration -= dt;
      });

      this.deathPieces = this.deathPieces.filter((p) => p.duration > 0);
      return;
    }

    const dx = Math.cos(this.angle) * Player.speed * dt;
    const dy = Math.sin(this.angle) * Player.speed * dt;

    if (this.event.keys["ArrowUp"] || this.event.keys["w"]) {
      this.x += dx;
      this.y += dy;
    }
    if (this.event.keys["ArrowDown"] || this.event.keys["s"]) {
      this.x -= dx * 0.8;
      this.y -= dy * 0.8;
    }
    if (this.event.keys["ArrowLeft"] || this.event.keys["a"]) {
      this.angle -= 4 * dt;
    }
    if (this.event.keys["ArrowRight"] || this.event.keys["d"]) {
      this.angle += 4 * dt;
    }

    if (this.event.isPressed(" ")) {
      Weapon.shoot(this.weapon, this.x, this.y, this.angle);
    }
  }

  reset([x, y, angle]) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.hp = 100;
    this.weapon = Math.floor(Math.random() * 2) + 1;
    this.isAlive = true;
    this.deathPieces = [];
  }

  takingDamage(dmg) {
    this.hp -= dmg;

    if (this.hp <= 0) {
      this.isAlive = false;
      this.deathPieces = [...Array(15)].map(() => ({
        x: this.x,
        y: this.y,
        rotation: Math.random() * Math.PI * 2 - Math.PI,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 5 + 2,
        duration: Math.random() * 2 + 1,
      }));
    }
  }

  getRect() {
    return [
      { x: this.x - Player.size / 2, y: this.y - Player.size / 2 },
      { x: this.x + Player.size / 2, y: this.y - Player.size / 2 },
      { x: this.x + Player.size / 2, y: this.y + Player.size / 2 },
      { x: this.x - Player.size / 2, y: this.y + Player.size / 2 },
    ];
  }

  toJSON() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      angle: this.angle,
      color: this.color,
      hp: this.hp,
      weapon: this.weapon,
      isAlive: this.isAlive,
      deathPieces: this.deathPieces,
    };
  }
}
