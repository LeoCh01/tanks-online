import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import http from "http";
import { Server } from "socket.io";

import tankAPI from "./api/tankAPI.js";

const PORT = 5000;
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(
  rateLimit({
    windowMs: 60 * 1000 * 15,
    max: 100,
  }),
  express.json(),
  cors({
    origin: "*",
  })
);

// Routes
app.use("api/tank", tankAPI(io));

server.listen(PORT, "192.168.2.42", () => console.log(`Server running on port ${PORT}`));
