import { fileURLToPath } from "node:url";
import Fastify from "fastify";
import FastifyVite from "@fastify/vite";
import fastifyStatic from "@fastify/static";

import {
  SyncService,
  DBCache,
  ServiceDB,
  FSNotify,
  DefaultConfig,
} from "@vlcn.io/direct-connect-nodejs";
import { JsonSerializer } from "@vlcn.io/direct-connect-common";

const PORT = parseInt(process.env.PORT || "8080");

const svcDb = new ServiceDB(DefaultConfig, true);
const dbCache = new DBCache(DefaultConfig, (name, version) => {
  return svcDb.getSchema("default", name, version);
});
const fsNotify = new FSNotify(DefaultConfig, dbCache);
const syncSvc = new SyncService(DefaultConfig, dbCache, svcDb, fsNotify);
const serializer = new JsonSerializer();

export async function main() {
  const server = Fastify({
    logger: true,
  });
  const dev = process.argv.includes("--dev");

  await server.register(FastifyVite, {
    root: import.meta.url,
    dev,
    spa: true,
  });

  await server.register(fastifyStatic, {
    root: new URL("./public", import.meta.url),
  });

  server.setErrorHandler(function (error, request, reply) {
    // Log error
    console.error(error);
    // Send error response
    reply.status(500).send({ ok: false });
  });

  server.get("/", (req, reply) => {
    reply.html();
  });

  server.post("/sync/changes", async (req, res) => {
    const msg = serializer.decode(req.body);
    const ret = await syncSvc.applyChanges(msg);
    res.send(serializer.encode(ret));
  });

  server.post("/sync/create-or-migrate", async (req, res) => {
    const msg = serializer.decode(req.body);
    const ret = await syncSvc.createOrMigrateDatabase(msg);
    res.send(serializer.encode(ret));
  });

  server.get("/sync/start-outbound-stream", async (req, res) => {
    console.log("Start outbound stream");
    const msg = serializer.decode(
      JSON.parse(decodeURIComponent(req.query.msg))
    );
    const headers = {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    };
    res.raw.writeHead(200, headers);

    // TODO: just throw on schema mismatch rather than providing a response
    const [stream, initialResponse] = await syncSvc.startOutboundStream(msg);
    res.raw.write(
      `data: ${JSON.stringify(serializer.encode(initialResponse))}\n\n`
    );

    stream.addListener((changes) => {
      res.raw.write(
        `data: ${JSON.stringify(serializer.encode(changes))}\n\n`,
        (err) => {
          if (err != null) {
            console.error(err);
            stream.close();
          }
        }
      );
    });

    req.raw.on("close", () => {
      console.log("Close outbound stream");
      stream.close();
    });
  });

  await server.vite.ready();
  return server;
}

if (process.argv[1] === fileURLToPath(new URL(import.meta.url))) {
  const server = await main();
  await server.listen({ port: PORT });
  console.log(`Server listening at http://localhost:${PORT}`);
}
