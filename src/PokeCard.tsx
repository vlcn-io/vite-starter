import { CtxAsync } from "@vlcn.io/react";
import { CurrentPokeman, SEND } from "./Types";
import nanoid from "./support/nanoid";
import TradeCode from "./TradeCode";
import { useState } from "react";

export default function PokeCard({
  ctx,
  currentPokeman,
}: {
  ctx: CtxAsync;
  currentPokeman: CurrentPokeman;
}) {
  const [override, setOverride] = useState(false);
  function maybeInitiateTrade() {
    if (currentPokeman.direction === SEND) {
      setOverride((o) => !o);
      // already sending
      return;
    }
    // TODO: could have a double tap...
    // could do a tx to check that we're not alredy sending to get around double tap.
    // sync rx would fix...
    ctx.db.exec(
      /*sql*/ `INSERT INTO poke_log (id, seq, owner_id, poke, direction)
        VALUES (?, (SELECT coalesce(max(seq), 0) + 1 FROM poke_log WHERE owner_id = ?), ?, ?, ?)`,
      [nanoid(), ctx.db.siteid, ctx.db.siteid, currentPokeman.poke, SEND]
    );
  }

  if (currentPokeman.direction === SEND && !override) {
    return (
      <div
        onClick={() => {
          setOverride((o) => !o);
        }}
      >
        <TradeCode poke={currentPokeman.poke} />
        <h2>
          Your{" "}
          <span style={{ textTransform: "capitalize", color: "red" }}>
            {currentPokeman.poke}
          </span>{" "}
          is ready!
          <br /> Have any other person at dweb scan this QR code to mate!
        </h2>
      </div>
    );
  }

  return (
    <div
      style={{ cursor: "pointer", position: "relative" }}
      onClick={maybeInitiateTrade}
    >
      <img src={`/pokemon/${currentPokeman.poke}.png`}></img>
      <h1 style={{ textTransform: "capitalize", marginTop: 0 }}>
        {currentPokeman.poke}
      </h1>
      <p>
        <strong>(tap the Pokemon to mate!!!)</strong>
      </p>
    </div>
  );
}
