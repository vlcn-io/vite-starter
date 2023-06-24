import "./App.css";
import { first, firstPick, useDB, useQuery } from "@vlcn.io/react";
import Register from "./Register";
import Intro from "./Intro";
import PokeDash from "./PokeDash";
import { CurrentPokeman } from "./Types";

function App({ dbid }: { dbid: string }) {
  const ctx = useDB(dbid);
  const player = useQuery<{ name: string }, string | undefined>(
    ctx,
    /*sql*/ `SELECT "name" FROM "player" WHERE "id" = ?`,
    [ctx.db.siteid],
    firstPick
  ).data;
  const myCurrentPokeman = useQuery<CurrentPokeman, CurrentPokeman | undefined>(
    ctx,
    /*sql*/ `SELECT "poke", "direction" FROM "poke_log" WHERE "owner_id" = ? ORDER BY "seq" DESC LIMIT 1`,
    [ctx.db.siteid],
    first
  ).data;
  if (player == null) {
    return <Register ctx={ctx} />;
  }
  if (myCurrentPokeman == null) {
    return <Intro ctx={ctx} />;
  }
  return (
    <PokeDash ctx={ctx} player={player} currentPokeman={myCurrentPokeman} />
  );
}

export default App;

/*
- if last event is sent, present a QR code
- On receipt, present QR code for current poke.
  Let user scan it to receive. Time bound? Poke can be destroyed?
*/
