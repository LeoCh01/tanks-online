import { BASE_URL } from "../config.js";
import Player from "../models/player.js";
import Projectile from "../models/projectile.js";
import GameMap from "../models/gameMap.js";

export default class Client {
  static players = {};
  static projectiles = [];
  static gameMap;
  static id;
  static socket;

  static syncEvent(event, key) {
    Client.socket.emit("event", { event, key });
  }

  static connect() {
    Client.socket = io.connect(BASE_URL + "/io/tank");

    Client.socket.on("connect", () => {
      Client.id = Client.socket.id;
    });

    Client.socket.on("gameState", (data) => {
      data.players.forEach((p) => {
        if (Client.players[p.id]) {
          Client.players[p.id].update(p);
        } else {
          Client.players[p.id] = new Player(p);
        }
      });
      Client.projectiles = data.projectiles.map((p) => Projectile.fromJSON(p));
    });

    Client.socket.on("gameMap", (data) => {
      Client.gameMap = GameMap.fromJSON(data);
    });

    Client.socket.on("userDisconnected", (uid) => {
      delete Client.players[uid];
    });
  }
}
