import express from "express";
import ViteExpress from "vite-express";
import { attachWebsocketServer } from "@vlcn.io/ws-server";
import * as http from "http";
import {
  createLiteFSDBFactory,
  createLiteFSWriteService,
  FSNotify,
} from "@vlcn.io/ws-litefs";

const PORT = parseInt(process.env.PORT || "8080");

const app = express();
const server = http.createServer(app);
// TODO: better way to check for litefs?
const isLiteFS = process.env.FLY_APP_NAME != null;

const wsConfig = {
  dbFolder: "./dbs",
  schemaFolder: "./src/schemas",
  pathPattern: /\/sync/,
  appName: process.env.FLY_APP_NAME || undefined,
};

let dbCache;
if (isLiteFS) {
  const dbFactory = await createLiteFSDBFactory(9000, wsConfig);
  dbCache = attachWebsocketServer(
    server,
    wsConfig,
    dbFactory,
    new FSNotify(wsConfig)
  );

  createLiteFSWriteService(9000, wsConfig, dbCache);
} else {
  attachWebsocketServer(server, wsConfig);
}

server.listen(PORT, () =>
  console.log("info", `listening on http://localhost:${PORT}!`)
);

ViteExpress.bind(app, server);
