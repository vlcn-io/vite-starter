import worker from "@vlcn.io/direct-connect-browser/shared.worker.js?url";
import wasm from "@vlcn.io/crsqlite-wasm/crsqlite.wasm?url";

export const endpoints = {
  createOrMigrate: updatePort(
    new URL("/sync/create-or-migrate", window.location.origin)
  ),
  applyChanges: updatePort(new URL("/sync/changes", window.location.origin)),
  startOutboundStream: updatePort(
    new URL("/sync/start-outbound-stream", window.location.origin)
  ),
  // this conditional on dev mode is to work around a bug in Vite.
  worker: import.meta.env.DEV ? worker : undefined,
  wasm,
};

function updatePort(u: URL) {
  if (import.meta.env.DEV) {
    u.port = "8080";
  }
  return u;
}
