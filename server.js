import express from "express";
import {
  SyncService,
  DBCache,
  ServiceDB,
  FSNotify,
  DefaultConfig,
} from "@vlcn.io/direct-connect-nodejs";
import { JsonSerializer } from "@vlcn.io/direct-connect-common";
import { spawn } from "child_process";
import cors from "cors";

const PORT = parseInt(process.env.PORT || "8080");

const app = express();
app.use(express.json());

const svcDb = new ServiceDB(DefaultConfig, true);
const dbCache = new DBCache(DefaultConfig, (name, version) => {
  return svcDb.getSchema("default", name, version);
});
const fsNotify = new FSNotify(DefaultConfig, dbCache);
const syncSvc = new SyncService(DefaultConfig, dbCache, svcDb, fsNotify);
const serializer = new JsonSerializer();

// serve the frontend in production
if (!process.argv.includes("--dev")) {
  app.use(express.static("public"));
  app.use(express.static("dist"));
}

app.post(
  "/sync/changes",
  cors(),
  makeSafe(async (req, res) => {
    const msg = serializer.decode(req.body);
    const ret = await syncSvc.applyChanges(msg);
    res.json(serializer.encode(ret));
  })
);

app.post(
  "/sync/create-or-migrate",
  cors(),
  makeSafe(async (req, res) => {
    const msg = serializer.decode(req.body);
    const ret = await syncSvc.createOrMigrateDatabase(msg);
    res.json(serializer.encode(ret));
  })
);

app.get(
  "/sync/start-outbound-stream",
  cors(),
  makeSafe(async (req, res) => {
    console.log("Start outbound stream");
    const msg = serializer.decode(
      JSON.parse(decodeURIComponent(req.query.msg))
    );
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // TODO: just throw on schema mismatch rather than providing a response
    const [stream, initialResponse] = await syncSvc.startOutboundStream(msg);
    res.write(
      `data: ${JSON.stringify(serializer.encode(initialResponse))}\n\n`
    );

    stream.addListener((changes) => {
      res.write(
        `data: ${JSON.stringify(serializer.encode(changes))}\n\n`,
        (err) => {
          if (err != null) {
            console.error(err);
            stream.close();
          }
        }
      );
    });

    req.on("close", () => {
      console.log("Close outbound stream");
      stream.close();
    });
  })
);

app.listen(PORT, () =>
  console.log(`Server listening at http://localhost:${PORT}`)
);

// if process args contain the dev flag, fork off `vite` to serve the frontend
if (process.argv.includes("--dev")) {
  // also create a symlink to the wasm file so vite can find it
  const vite = spawn("./node_modules/.bin/vite", {
    stdio: "inherit",
  });
  vite.on("close", (code) => {
    console.log(`vite exited with code ${code}`);
    process.exit(code);
  });
}

/**
 *
 * @param {import("express").RequestHandler} handler
 * @returns {import("express").RequestHandler}
 */
function makeSafe(handler) {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
}
