import express from "express";
import ViteExpress from "vite-express";
import { attachWebsocketServer } from "@vlcn.io/ws-server";
import * as http from "http";
import {
  createLiteFSDBFactory,
  createLiteFSWriteService,
} from "@vlcn.io/ws-litefs";

const PORT = parseInt(process.env.PORT || "8080");

const app = express();
const server = http.createServer(app);

const wsConfig = {
  dbFolder: "./dbs",
  schemaFolder: "./src/schemas",
  pathPattern: /\/sync/,
};
const dbFactory = await createLiteFSDBFactory(9000, wsConfig);
const dbCache = attachWebsocketServer(server, wsConfig, dbFactory);
createLiteFSWriteService(9000, wsConfig, dbCache);

server.listen(PORT, () =>
  console.log("info", `listening on http://localhost:${PORT}!`)
);

ViteExpress.bind(app, server);
