import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { WorkerInterface, newDbid } from "@vlcn.io/direct-connect-browser";
import workerUrl from "@vlcn.io/direct-connect-browser/shared.worker.js?url";
import wasmUrl from "@vlcn.io/crsqlite-wasm/crsqlite.wasm?url";
import initWasm from "@vlcn.io/crsqlite-wasm";
import tblrx from "@vlcn.io/rx-tbl";
import testSchema from "./schemas/testSchema.mjs"

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
  return hash.dbid || localStorage.getItem('remoteDbid') || newDbid();
}

const hash = parseHash();
const remoteDbid = getRemoteDbid(hash);
if (remoteDbid != hash.dbid) {
  hash.dbid = remoteDbid;
  window.location.hash = writeHash(hash);
}
localStorage.setItem('remoteDbid', remoteDbid);

// Now that we have a remote dbid, we can open our corresponding local db.
const sqlite = await initWasm(() => wasmUrl);
const db = await sqlite.open(remoteDbid);

// Automigrate our local db to the schema we want to use.
await db.automigrateTo(testSchema.name, testSchema.content);

// Install the reactivity extensions for our local db.
const rx = tblrx(db);

// Start the sync worker which will sync our local changes to the remote db.
const syncWorker = new WorkerInterface(workerUrl, wasmUrl);
syncWorker.startSync(
  remoteDbid as any,
  {
    createOrMigrate: new URL("/sync/create-or-migrate", window.location.origin),
    applyChanges: new URL("/sync/changes", window.location.origin),
    startOutboundStream: new URL(
      "/sync/start-outbound-stream",
      window.location.origin
    ),
  },
  rx
);

// Launch our app.
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <App ctx={{
      db,
      rx,
    }} />,
)

type HashBag = {[key: string]: string};
function parseHash(): HashBag {
  const hash = window.location.hash;
  const ret: {[key: string]: string} = {};
  if (hash.length > 1) {
    const substr = hash.substring(1);
    const parts = substr.split(',');
    for (const part of parts) {
      const [key, value] = part.split('=');
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
  return parts.join(',');
}
