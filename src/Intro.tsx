import { CtxAsync } from "@vlcn.io/react";
import { useState } from "react";
import nanoid from "./support/nanoid";
import { RECEIVE } from "./Types";

export default function Intro({ ctx }: { ctx: CtxAsync }) {
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function seedPlayer() {
    setSeeding(true);
    try {
      const resp = await fetch(
        window.location.protocol + "//" + window.location.hostname + "/seed"
      );
      const json = await resp.json();
      if (json.err) {
        setError(json.err);
        setSeeding(false);
        return;
      }

      await ctx.db.exec(
        /*sql*/ `INSERT INTO poke_log (id, seq, owner_id, poke, direction)
          VALUES
          (?, (SELECT coalesce(seq, 0) + 1 FROM poke_log WHERE owner_id = ?), ?, ?, ?)`,
        [nanoid(), ctx.db.siteid, ctx.db.siteid, json.pokemon, RECEIVE]
      );
      setSeeding(false);
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setSeeding(false);
    }
  }
  return (
    <div style={{ maxWidth: 600 }}>
      <h1>Poke Pass!</h1>
      <p style={{ textAlign: "left" }}>
        The goal of Poke Pass is to trade as many unique Pokemon as possible.
        <br />
        Find someone that has a Pokemon you've never seen and trade with them!
      </p>
      {/* <div style={{ textAlign: "left" }}>
        A Poke List and Leader Board are provided to help you:
        <ol>
          <li>Find players that have Pokemon you haven't traded with yet</li>
          <li>See who is winning</li>
        </ol>
      </div> */}
      <h1>
        <button onClick={seedPlayer} disabled={seeding}>
          {seeding ? "Teleporting 👽..." : "Let's Play!"}
        </button>
      </h1>
      {error != null ? <strong style={{ color: "red" }}>{error}</strong> : null}
    </div>
  );
}
