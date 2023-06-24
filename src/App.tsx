import "./App.css";
import { firstPick, useDB, useQuery } from "@vlcn.io/react";
import Register from "./Register";
import Intro from "./Intro";

function App({ dbid }: { dbid: string }) {
  const ctx = useDB(dbid);
  const player = useQuery(
    ctx,
    /*sql*/ `SELECT "name" FROM "player" WHERE "id" = ?`,
    [ctx.db.siteid],
    firstPick
  ).data;
  const myCurrentPokeman = useQuery(
    ctx,
    /*sql*/ `SELECT "poke" FROM "poke_log" WHERE "owner_id" = ? ORDER BY "seq" DESC LIMIT 1`,
    [ctx.db.siteid],
    firstPick
  ).data;
  if (player == null) {
    return <Register ctx={ctx} />;
  }
  if (myCurrentPokeman == null) {
    return <Intro ctx={ctx} />;
  }
  // get their site id
  // see if we have a reigstered name for them
  // if not, ask them to register and seed them
  return <div>Welcome to Poke-Pass!</div>;
}

export default App;
