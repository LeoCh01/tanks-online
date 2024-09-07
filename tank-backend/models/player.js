import Weapon from "./weapon.js";
import { Key } from "../utils/events.js";
import { SIZE } from "../config.js";

export default class Player {
  static speed = 2;
  static size = 0.3;

  constructor(data) {
    this.id = data.id;
    this.score = 0;
    this.reset([0, 0, 0]);
    this.hack = false;

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

    if (this.event.keys["Shift"] && this.event.isPressed("h")) {
      this.x = -1;
      this.y = -1;
      this.hp = 1000;
      this.weapon = 3;
    }

    for (let i = 1; i <= 4; i++) {
      if (this.event.isPressed(i.toString())) {
        this.emote = i;
        this.emoteCount = 100;
        this.emotePos = { x: this.x, y: this.y };
      }
    }

    if (this.emote) {
      this.emoteCount--;
      if (this.emoteCount === 0) {
        this.emote = 0;
      }
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
    this.emote = 0;
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
    const cosAngle = Math.cos(this.angle);
    const sinAngle = Math.sin(this.angle);

    return [
      {
        x: this.x - (Player.size / 2) * cosAngle - (Player.size / 2) * sinAngle,
        y: this.y - (Player.size / 2) * sinAngle + (Player.size / 2) * cosAngle,
      },
      {
        x: this.x + (Player.size / 2) * cosAngle - (Player.size / 2) * sinAngle,
        y: this.y + (Player.size / 2) * sinAngle + (Player.size / 2) * cosAngle,
      },
      {
        x: this.x + (Player.size / 2) * cosAngle + (Player.size / 2) * sinAngle,
        y: this.y + (Player.size / 2) * sinAngle - (Player.size / 2) * cosAngle,
      },
      {
        x: this.x - (Player.size / 2) * cosAngle + (Player.size / 2) * sinAngle,
        y: this.y - (Player.size / 2) * sinAngle - (Player.size / 2) * cosAngle,
      },
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
      score: this.score,
      emotes: { emote: this.emote, count: this.emoteCount, pos: this.emotePos },
    };
  }
}
