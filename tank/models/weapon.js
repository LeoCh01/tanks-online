import { ctx, PP } from "../config.js";
import Player from "./player.js";

export default class Weapon {
  constructor() {}

  static draw(type) {
    switch (type) {
      case 1:
        this.drawType1();
        break;
      case 2:
        this.drawType2();
        break;
      case 3:
        this.drawType3();
        break;
      case 4:
        this.drawType4();
        break;
    }
  }

  static drawType1() {
    ctx.fillStyle = "#ff6767";
    ctx.fillRect(-PP(0.1 * Player.size), -PP(0.15 * Player.size), PP(Player.size), PP(0.3 * Player.size));
  }

  static drawType2() {}

  static drawType3() {}
}
