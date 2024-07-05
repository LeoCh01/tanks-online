import { canvas } from "../config.js";

export class Key {
  static keys = {};
  static pressed = {};

  static addEventListeners() {
    window.addEventListener("keydown", (e) => {
      Key.keys[e.key] = true;
    });

    window.addEventListener("keyup", (e) => {
      Key.keys[e.key] = false;
      this.pressed[e.key] = false;
    });
  }

  static isPressed(key) {
    if (Key.keys[key] && !this.pressed[key]) {
      this.pressed[key] = true;
      return true;
    } else {
      return false;
    }
  }
}

export class Mouse {
  static mouse = { x: 0, y: 0, clicked: false };

  static addEventListeners() {
    canvas.addEventListener("mousemove", (event) => {
      Mouse.mouse.x = event.clientX - canvas.offsetLeft;
      Mouse.mouse.y = event.clientY - canvas.offsetTop;
    });

    canvas.addEventListener("mousedown", (event) => {
      Mouse.mouse.clicked = true;
    });

    canvas.addEventListener("mouseup", (event) => {
      Mouse.mouse.clicked = false;
    });
  }
}

Key.addEventListeners();
Mouse.addEventListeners();
