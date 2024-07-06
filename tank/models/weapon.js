import { ctx, PP } from "../config.js";
import Projectile from "./projectile.js";
import Client from "../utils/client.js";

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
    ctx.fillRect(-PP(0.1), -PP(0.1), PP(1), PP(0.2));
  }

  static drawType2() {
    ctx.fillStyle = "#677bff";
    ctx.fillRect(-PP(0.1), -PP(0.1), PP(1), PP(0.2));
  }

  static drawType3() {
    ctx.fillStyle = "#ff6767";
    ctx.fillRect(-PP(0.1), -PP(0.1), PP(1), PP(0.2));
  }

  static drawType4() {
    ctx.fillStyle = "#ff6767";
    ctx.fillRect(-PP(0.1), -PP(0.1), PP(1), PP(0.2));
  }
}
