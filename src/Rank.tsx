import { CtxAsync, firstPick, useQuery } from "@vlcn.io/react";
import { Link } from "react-router-dom";

export default function Rank({ ctx }: { ctx: CtxAsync }) {
  const rank = useQuery<{ rank: number }, number | undefined>(
    ctx,
    /*sql*/ `SELECT rank FROM 
      (SELECT owner_id, (ROW_NUMBER() OVER()) as rank FROM 
        (SELECT count(DISTINCT poke) - 1 as count, owner_id FROM poke_log GROUP BY owner_id ORDER BY count DESC)) WHERE owner_id = ?;`,
    [ctx.db.siteid],
    firstPick
  );
  return (
    <Link to="/leaderboard" style={{ flexGrow: 1 }}>
      Rank: {rank.data || "Unk"}
      {rank.data != null ? suffixes[rank.data - 1] || "th" : ""}
    </Link>
  );
}

const suffixes = ["st", "nd", "rd", "th"];
