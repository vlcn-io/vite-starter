import "./App.css";
import { firstPick, useDB, useQuery } from "@vlcn.io/react";
import Register from "./Register";
import Intro from "./Intro";
import PokeDash from "./PokeDash";

function App({ dbid }: { dbid: string }) {
  const ctx = useDB(dbid);
  const player = useQuery(
    ctx,
    /*sql*/ `SELECT "name" FROM "player" WHERE "id" = ?`,
    [ctx.db.siteid],
    firstPick
  ).data;
  const myCurrentPokeman = useQuery<{ poke: string }, string | undefined>(
    ctx,
    /*sql*/ `SELECT "poke" FROM "poke_log" WHERE "owner_id" = ? AND "direction" = 1 ORDER BY "seq" DESC LIMIT 1`,
    [ctx.db.siteid],
    firstPick
  ).data;
  if (player == null) {
    return <Register ctx={ctx} />;
  }
  if (myCurrentPokeman == null) {
    return <Intro ctx={ctx} />;
  }
  return <PokeDash ctx={ctx} currentPokemon={myCurrentPokeman} />;
}

export default App;
