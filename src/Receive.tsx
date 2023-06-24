import { CtxAsync } from "@vlcn.io/react";
import { useEffect } from "react";
import { RECEIVE } from "./Types";
import TradeCode from "./TradeCode";

export default function Receive({ ctx }: { ctx: CtxAsync }) {
  // Check that we don't currently have this thing.
  const queryParams = new URLSearchParams(window.location.search);
  const nonce = queryParams.get("nonce");
  const from = queryParams.get("from");
  const to = queryParams.get("to");
  const poke = queryParams.get("poke");

  if (to != null && to != ctx.db.siteid) {
    return <h2>You are not the intended recipient for this Pokemon!</h2>;
  }

  if (nonce == null || from == null || poke == null) {
    return <h2>Missing expected parameters for the trade</h2>;
  }

  return <ReceiveInner ctx={ctx} nonce={nonce} from={from} poke={poke} />;
}

function ReceiveInner({
  ctx,
  nonce,
  from,
  poke,
}: {
  ctx: CtxAsync;
  nonce: string;
  from: string;
  poke: string;
}) {
  useEffect(() => {
    ctx.db.exec(
      /*sql*/ `INSERT OR IGNORE INTO poke_log (id, seq, owner_id, poke, direction)
        VALUES (?, (SELECT coalesce(max(seq), 0) + 1 FROM poke_log WHERE owner_id = ?), ?, ?, ?)`,
      [nonce, ctx.db.siteid, ctx.db.siteid, poke, RECEIVE]
    );
  }, []);

  return (
    <div>
      <h2>
        <span style={{ color: "red", textTransform: "capitalize" }}>
          {poke}
        </span>{" "}
        received!
        <br />
        Make sure your partner has gotten your Pokemon!
        <br />
        Use the QR code below if not!
      </h2>
      <TradeCode ctx={ctx} poke={poke} to={from} />
    </div>
  );
}
