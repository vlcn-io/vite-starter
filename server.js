import express from "express";
import ViteExpress from "vite-express";
import {
  SyncService,
  DBCache,
  ServiceDB,
  FSNotify,
  DefaultConfig,
} from "@vlcn.io/direct-connect-nodejs";
import { JsonSerializer } from "@vlcn.io/direct-connect-common";
import https from "https";
import http from "http";
import os from "os";
import fs from "fs";
import pokemon from "./pokemon-names.js";

// const PORT = parseInt(process.env.PORT || "8080");

const app = express();
app.use(express.json());

const svcDb = new ServiceDB(DefaultConfig, true);
const dbCache = new DBCache(DefaultConfig, (name, version) => {
  return svcDb.getSchema("default", name, version);
});
const fsNotify = new FSNotify(DefaultConfig, dbCache);
const syncSvc = new SyncService(DefaultConfig, dbCache, svcDb, fsNotify);
const serializer = new JsonSerializer();

app.post(
  "/sync/changes",
  makeSafe(async (req, res) => {
    const msg = serializer.decode(req.body);
    const ret = await syncSvc.applyChanges(msg);
    res.json(serializer.encode(ret));
  })
);

app.post(
  "/sync/create-or-migrate",
  makeSafe(async (req, res) => {
    const msg = serializer.decode(req.body);
    const ret = await syncSvc.createOrMigrateDatabase(msg);
    res.json(serializer.encode(ret));
  })
);

app.get(
  "/sync/start-outbound-stream",
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

// TODO: an example of a case where we want to write the db from the server
// to recording seeding information
app.get("/seed", (req, res) => {
  fs.readFile(
    "./seed-count",
    {
      encoding: "utf-8",
    },
    (err, str) => {
      if (err) {
        res.json({ err: "failed reading next seed" });
        return;
      }
      const index = parseInt(str);
      fs.writeFile("./seed-count", `${index + 1}`, (err) => {
        if (err) {
          res.json({ err: "failed writing next seed" });
          return;
        }
        res.send({ pokemon: pokemon[index % pokemon.length] });
      });
    }
  );
});

app.post("/exchange", (req, res) => {
  // exchange is:
  // [player_id1, poke]
  // [player_id2, poke]
  // makes a trade id and swaps them in the log
  // or we can do webrtc where the qr code creator creates the tradeid
  // and both devices write under that tradeid
  // hmmm.. no b/c not unique on tradeid.
  // qr code generator would create both pks for the two log entries
  // or each devices writes the singular entry it is responsible for?
  // cross device transaction??
  // easiest in server to write the swap?
});

app.get("/index.html", (req, res) => {
  res.redirect("/");
});

const options = {
  key: fs.readFileSync("./certs/dweb.city.key"),
  cert: fs.readFileSync("./certs/dweb.city.pem"),
};
const server = https.createServer(options, app).listen(443, () => {
  console.log(`Server listening at https://${os.hostname}.d.dweb.city`);
});

const app2 = express();
app2.get("/", (req, res) => {
  res.redirect("https://pokemon.d.dweb.city");
});
const redir = http.createServer(app2).listen(80, () => {
  console.log("http redir up");
});

ViteExpress.bind(app, server);

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
