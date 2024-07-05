export class Key {
  constructor() {
    this.keys = {};
    this.pressed = {};
  }

  onKeyDown(key) {
    this.keys[key] = true;
  }

  onKeyUp(key) {
    this.keys[key] = false;
    this.pressed[key] = false;
  }

  isPressed(key) {
    if (this.keys[key] && !this.pressed[key]) {
      this.pressed[key] = true;
      return true;
    } else {
      return false;
    }
  }
}
