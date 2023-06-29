import { CtxAsync } from "@vlcn.io/react";
import { useEffect } from "react";
import { RECEIVE } from "./Types";
import nanoid from "./support/nanoid";
import names from "../pokemon-names";
import { useNavigate } from "react-router-dom";

export default function Receive({ ctx }: { ctx: CtxAsync }) {
  // Check that we don't currently have this thing.
  const queryParams = new URLSearchParams(window.location.search);
  // const nonce = queryParams.get("nonce");
  // const from = queryParams.get("from");
  // const to = queryParams.get("to");
  const poke = queryParams.get("poke");

  // if (to != null && to != ctx.db.siteid) {
  //   return <h2>You are not the intended recipient for this Pokemon!</h2>;
  // }

  return <ReceiveInner ctx={ctx} poke={poke || ""} />;
}

function ReceiveInner({ ctx, poke }: { ctx: CtxAsync; poke: string }) {
  const navigate = useNavigate();
  useEffect(() => {
    ctx.db
      .exec(
        /*sql*/ `INSERT OR REPLACE INTO poke_log (id, seq, owner_id, poke, direction)
        VALUES (?, (SELECT coalesce(max(seq), 0) + 1 FROM poke_log WHERE owner_id = ?), ?, ?, ?)`,
        [
          nanoid(),
          ctx.db.siteid,
          ctx.db.siteid,
          names[(Math.random() * names.length) | 0],
          RECEIVE,
        ]
      )
      .then(() => {
        navigate("/");
      });
  }, []);

  return (
    <div>
      <h2>
        <span style={{ color: "red", textTransform: "capitalize" }}>
          {poke}
        </span>{" "}
        mated!
      </h2>
    </div>
  );
}
