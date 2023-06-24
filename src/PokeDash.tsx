import { CtxAsync } from "@vlcn.io/react";
import PokeCard from "./PokeCard";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Leaderboard from "./Leaderboard";
import Trades from "./Trades";
import Help from "./Tracker";
import Nav from "./Nav";
import { CurrentPokeman } from "./Types";
import Receive from "./Receive";

export default function PokeDash({
  ctx,
  currentPokeman,
  player,
}: {
  ctx: CtxAsync;
  currentPokeman: CurrentPokeman;
  player: string;
}) {
  return (
    <BrowserRouter>
      <Nav ctx={ctx} player={player} />
      <Routes>
        <Route
          path="/"
          element={<PokeCard ctx={ctx} currentPokeman={currentPokeman} />}
        />
        <Route path="/leaderboard" element={<Leaderboard ctx={ctx} />} />
        <Route path="/trades" element={<Trades ctx={ctx} />} />
        <Route path="/help" element={<Help ctx={ctx} />} />
        <Route path="/receive" element={<Receive ctx={ctx} />} />
      </Routes>
    </BrowserRouter>
  );
}
