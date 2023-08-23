import express from "express";
import ViteExpress from "vite-express";
import { attachWebsocketServer } from "@vlcn.io/ws-server";
import * as http from "http";

const PORT = parseInt(process.env.PORT || "8080");

const app = express();
const server = http.createServer(app);

attachWebsocketServer(server, {
  dbFolder: "./dbs",
  schemaFolder: "./src/schemas",
  pathPattern: /\/sync/,
});

server.listen(PORT, () =>
<<<<<<< HEAD
  console.log("info", `listening on http://localhost:${PORT}!`)
=======
  console.log("info", `listening on https://localhost:${PORT}!`)
>>>>>>> f092e00 (websocket sync, new react hooks, use react strict mode)
);

ViteExpress.bind(app, server);
