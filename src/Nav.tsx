import { CtxAsync } from "@vlcn.io/react";
import { Link } from "react-router-dom";
import Rank from "./Rank";
import UniqueTrades from "./UniqueTrades";

export default function Nav({
  ctx,
  player,
}: {
  ctx: CtxAsync;
  player: string;
}) {
  return (
    <div>
      <h2>{player}</h2>
      <header
        style={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <Link to="/" style={{ flexGrow: 1 }}>
          🏠
        </Link>
        <UniqueTrades ctx={ctx} />
        <Link to="/help" style={{ flexGrow: 1 }}>
          Tracker
        </Link>
        <Rank ctx={ctx} />
      </header>
    </div>
  );
}
