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

const litefsConfig = {
  port: 9000,
  primaryFileDir: "/var/lib/litefs",
  primaryFile: ".primary",
};
const wsConfig = {
  dbFolder: "./dbs",
  schemaFolder: "./src/schemas",
  pathPattern: /\/sync/,
};
const dbFactory = await createLiteFSDBFactory(litefsConfig);
const dbCache = attachWebsocketServer(server, wsConfig, dbFactory);
createLiteFSWriteService(litefsConfig, wsConfig, dbCache);

server.listen(PORT, () =>
  console.log("info", `listening on http://localhost:${PORT}!`)
);

ViteExpress.bind(app, server);
