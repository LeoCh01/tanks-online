import { ctx, PP } from "../config.js";
import Projectile from "./projectile.js";
import Client from "../utils/client.js";

export default class Weapon {
  constructor() {}

  draw() {
    ctx.fillStyle = "#ff6767";
    ctx.fillRect(-PP(0.1), -PP(0.1), PP(1), PP(0.2));
  }
}
