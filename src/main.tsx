import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import schemaContent from "./schemas/main.sql?raw";
import { DBProvider } from "@vlcn.io/react";
import React from "react";

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
function getRoom(hash: HashBag): string {
  return hash.room || localStorage.getItem("room") || newRoom();
}

const hash = parseHash();
const room = getRoom(hash);
if (room != hash.room) {
  hash.room = room;
  window.location.hash = writeHash(hash);
}
localStorage.setItem("room", room);

// Launch our app.
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <DBProvider
      dbname={room}
      schema={{
        name: "main.sql",
        content: schemaContent,
      }}
    >
      <App dbname={room} />
    </DBProvider>
  </React.StrictMode>
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

function newRoom() {
  return crypto.randomUUID().replaceAll("-", "");
}
