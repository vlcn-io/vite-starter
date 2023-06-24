import { CtxAsync } from "@vlcn.io/react";
import { CurrentPokeman, SEND } from "./Types";
import nanoid from "./support/nanoid";
import { useLayoutEffect, useRef, useState } from "react";
import QRCode from "qrcode";

export default function PokeCard({
  ctx,
  currentPokeman,
}: {
  ctx: CtxAsync;
  currentPokeman: CurrentPokeman;
}) {
  function maybeInitiateTrade() {
    if (currentPokeman.direction === SEND) {
      // already sending
      setOverride((o) => !o);
      return;
    }
    // TODO: could have a double tap...
    // could do a tx to check that we're not alredy sending to get around double tap.
    // sync rx would fix...
    ctx.db.exec(
      /*sql*/ `INSERT INTO poke_log (id, seq, owner_id, poke, direction)
        VALUES (?, (SELECT coalesce(seq, 0) + 1 FROM poke_log WHERE owner_id = ?), ?, ?, ?)`,
      [nanoid(), ctx.db.siteid, ctx.db.siteid, currentPokeman.poke, SEND]
    );
  }

  const [override, setOverride] = useState(false);

  return (
    <div
      style={{ cursor: "pointer", position: "relative" }}
      onClick={maybeInitiateTrade}
    >
      <img src={`/pokemon/${currentPokeman.poke}.png`}></img>
      {currentPokeman.direction === SEND && !override ? (
        <TradeCode ctx={ctx} currentPokeman={currentPokeman} />
      ) : null}
      <h1 style={{ textTransform: "capitalize", marginTop: 0 }}>
        {currentPokeman.poke}
      </h1>
      <p>(tap Pokemon to trade)</p>
    </div>
  );
}

function TradeCode({
  ctx,
  currentPokeman,
}: {
  ctx: CtxAsync;
  currentPokeman: CurrentPokeman;
}) {
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLCanvasElement | null>(null);
  useLayoutEffect(() => {
    QRCode.toCanvas(
      ref.current,
      "https://" +
        window.location.hostname +
        "/receive?poke=" +
        currentPokeman.poke +
        "&from=" +
        ctx.db.siteid,
      function (error: any) {
        if (error) {
          setError(error);
        } else {
          setError(null);
        }
      }
    );
  }, [currentPokeman.poke, ctx.db.siteid]);
  return (
    <div style={{ position: "absolute", top: 80, left: 100, opacity: 0.8 }}>
      {error ? error : null}
      <canvas ref={ref} style={{ zoom: 1.2 }} />
    </div>
  );
}
