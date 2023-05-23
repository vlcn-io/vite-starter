import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { newDbid } from "@vlcn.io/direct-connect-browser";
import schema from "./schemas/main.mjs";
import { endpoints } from "./SyncEndpoints.ts";
import { DBProvider } from "@vlcn.io/react";

/**
 * Returns the ID of a remote database to sync with or creates a new one
 * if none exists.
 *
 * This ID should be a 16 byte hex string.
 *
 * Ways you can get a remote db:
 * - Harcode the id in your app (not recommended)
 * - Return a DBID for the user after they log in
 * - Get it through link sharing, qr code, etc.
 *
 * Here we look at the URL for a DBID. If one does not exist we check localStorage if the user
 * ever opened one. If not, we randomly generate one and return it.
 *
 * Randomly generating a DBID will cause new databases to be created on both the client
 * and server.
 */
function getRemoteDbid(hash: HashBag): string {
  return hash.dbid || localStorage.getItem("remoteDbid") || newDbid();
}

const hash = parseHash();
const dbid = getRemoteDbid(hash);
if (dbid != hash.dbid) {
  hash.dbid = dbid;
  window.location.hash = writeHash(hash);
}
localStorage.setItem("remoteDbid", dbid);

// Launch our app.
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <DBProvider dbid={dbid} schema={schema} endpoints={endpoints}>
    <App dbid={dbid} />
  </DBProvider>
);

type HashBag = { [key: string]: string };
function parseHash(): HashBag {
  const hash = window.location.hash;
  const ret: { [key: string]: string } = {};
  if (hash.length > 1) {
    const substr = hash.substring(1);
    const parts = substr.split(",");
    for (const part of parts) {
      const [key, value] = part.split("=");
      ret[key] = value;
    }
  }

  return ret;
}

function writeHash(hash: HashBag) {
  const parts = [];
  for (const key in hash) {
    parts.push(`${key}=${hash[key]}`);
  }
  return parts.join(",");
}
