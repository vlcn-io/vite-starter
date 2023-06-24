import { CtxAsync, firstPick, useQuery } from "@vlcn.io/react";
import { Link } from "react-router-dom";

export default function UniqueTrades({ ctx }: { ctx: CtxAsync }) {
  const uniqueTradesMade = useQuery<{ count: number }, number | undefined>(
    ctx,
    /*sql*/ `SELECT count(DISTINCT poke) - 1 as count FROM poke_log WHERE owner_id = ?`,
    [ctx.db.siteid],
    firstPick
  ).data;
  return (
    <Link to="/trades" style={{ flexGrow: 1 }}>
      Score: {uniqueTradesMade || 0}
    </Link>
  );
}
