import express from "express";
import Player from "../models/player.js";
import Game from "../models/game.js";

const router = express.Router();

export default function (io) {
  io = io.of("/io/tank");
  const game = new Game(io);

  router.get("/", (req, res) => {
    res.send("tank API");
  });

  io.on("connection", (socket) => {
    const uid = socket.id;
    game.createNewPlayer(uid);
    console.log("A user connected", uid);
    socket.emit("uid", uid);

    socket.on("event", (data) => {
      const player = Game.players.get(uid);

      if (data.event === "keydown") {
        player.event.onKeyDown(data.key);
      } else if (data.event === "keyup") {
        player.event.onKeyUp(data.key);
      }
    });

    socket.on("disconnect", () => {
      Game.players.delete(uid);
      console.log("A user disconnected", uid);
      socket.broadcast.emit("userDisconnected", uid);
      if (Game.players.size === 0) {
        game.stop();
      }
    });
  });

  return router;
}
